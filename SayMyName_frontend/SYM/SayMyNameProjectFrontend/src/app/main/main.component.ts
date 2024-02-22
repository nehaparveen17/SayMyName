import { Component } from '@angular/core';
import { BehaviorSubject, Observable, Subject, interval, take } from "rxjs";
declare var $: any;
import * as RecordRTC from 'recordrtc';
import { DomSanitizer } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MatDialog } from '@angular/material/dialog';
import { DialogModuleComponent } from '../dialog-module/dialog-module.component';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})

export class MainComponent {
  title = 'micRecorder';
  //Lets declare Record OBJ
  public record: any;
  //URL of Blob
  public url: any;
  public error: any;
  public serverData: JSON | undefined;
  public employeeData: JSON | undefined;
  public mock: any | undefined;
  public studentDetails: any | undefined;
  public username: any | undefined;
  public studentID: any;
  public start_recording: boolean = false;
  public hide_default_recording_icon: boolean = true;
  public obs$ = interval(1000);
  public time_interval: number = 0;
  public limited$ = this.obs$.pipe(take(11));
  public disable_re_record: boolean = true;
  public display_content_card: boolean = false;
  public name_in_phonetics: string | undefined;
  public phoneticName: string | undefined;
  public soundsCorrectFlag: boolean = false;
  public displayGreatCapturedFlag: boolean = false;
  public tempMsg: boolean = false;
  public soundsWrongFlag: boolean = false;
  public edited_phonetics: string = '';


  // second phase of the project
  public listOfPronouns = [
    { value: '01', viewValue: 'She / Her' },
    { value: '02', viewValue: 'He / Him' },
    { value: '03', viewValue: 'They / Them' },
    { value: '04', viewValue: 'Prefer Not to Say' },
  ];

  public listOfIntake = [
    { value: '01', viewValue: 'Fall' },
    { value: '02', viewValue: 'January' },
    { value: '03', viewValue: 'May' },];
  public student_ID: string = '';
  public student_Name: string = '';
  public student_pronoun: string = '';
  public student_intake: string = '';
  public confirmed_Phonetics: string = ''
  public listOfPhonetics: any;
  public display_edit_search_bar: boolean = false;
  public show_functional_buttons: boolean = false;
  public feedbackFlag: boolean = false;
  public newNameFlag: boolean = false;
  public first_name: string = ''
  public last_name: string = ''
  public votes: number = 0
  public audion_binary_file_path: string = ''
  public final_phonetics: string = ''
  public edit_button_flag: boolean = false
  public dislike_button_flag: boolean = false
  public like_button_flag: boolean = false


  constructor(private domSanitizer: DomSanitizer,
    private toastr: ToastrService,
    private httpClient: HttpClient,
    private ngxService: NgxUiLoaderService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    let objArray = [{ foo: 1, bar: 2 }, { foo: 3, bar: 4 }, { foo: 5, bar: 6 }];
    let result = objArray.map(({ foo }) => foo)
    console.log(result)

  }

  openDialog(): void {
    let dialogRef = this.dialog.open(DialogModuleComponent, {
      width: '30%',
      data: { studentId: this.student_ID, preferredName: this.student_Name, Phonetics: this.final_phonetics }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('closed')
      this.feedbackFlag = true;
    });
  }




  // this method handles the user action from the user interface
  public handleUserAction = (type: string, event: any) => {
    switch (type) {
      case 'search': {
        // if(this.student_Name == undefined && this.first_name == undefined && this.last_name == undefined && this.student_pronoun == undefined){
          if (this.student_ID == '' || this.student_ID == null || this.student_ID == undefined) {
            this.displayMessage('Please enter the Student ID', 'ERROR')
          }
          else {
            if (/^\d+$/.test(this.student_ID)) {
              if (this.student_ID?.length == 9) {
                if(/[a-zA-Z ]+/.test(this.student_Name)){
               if(/[a-zA-Z ]+/.test(this.first_name)){
                if(/[a-zA-Z ]+/.test(this.last_name)){
                  let pronoun = ''
                  this.listOfPronouns.forEach((ele: any) => {
                    if (ele?.value === this.student_pronoun) {
                      pronoun = ele?.viewValue
                    }
                  })
          
                  let reqObj = {
                    "first_name": this.first_name,
                    "last_name": this.last_name,
                    "student_id": parseInt(this.student_ID),
                    "pronoun": pronoun,
                    "intake": "Fall",
                    "course": "AIGS",
                    "year": 2023,
                    "preferred_name": this.student_Name
                  }
                  this.getPhonetics(reqObj)
          
                  if (this.confirmed_Phonetics == '' || this.confirmed_Phonetics == undefined || this.confirmed_Phonetics == null) {
                    this.show_functional_buttons = false;
                  
          
                  }
                }
                else{
                 this.displayMessage('Last Name can only contain lower and uppercase alphabets inclusing space.', 'ERROR')
                }
               }
               else{
                this.displayMessage('First Name can only contain lower and uppercase alphabets inclusing space.', 'ERROR')
               }
                 
                }
                else {
                  this.displayMessage('Preferred Name can only contain lower and uppercase alphabets inclusing space.', 'ERROR')
                }
                
              }
              else {
                this.displayMessage('Student ID should be of 9 digits', 'ERROR')
              }
            }
            else {
              this.displayMessage('Student ID should be in number only', 'ERROR')
            }
          }
        // }
        // else {
        //   this.displayMessage('Please enter the details.', 'ERROR')
        // }
        break;
      }
      case 'phonetics-correct': {

        let reqObj = {
          student_id: parseInt(this.student_ID),
          userfeedback: 'Yes'

        }
        this.dislike_button_flag = true
        this.giveUserFeedback(reqObj)
        break;
      }
      case 'phonetics-wrong': {

        let reqObj = {
          student_id: parseInt(this.student_ID),
          userfeedback: 'No'
        }
        this.like_button_flag = true
        this.giveUserFeedback(reqObj)
        break;
      }
      case 'edit': {
        this.display_edit_search_bar = true;
        this.feedbackFlag = false;
        this.edited_phonetics = this.confirmed_Phonetics;
        break;
      }
      case 'phoneticsChanged': {
        this.edited_phonetics = event.value;
        this.show_functional_buttons = true;
        break;
      }
      case 'save': {
        let reqObj = {}
        if (this.edited_phonetics == '') {
          reqObj = {
            student_id: parseInt(this.student_ID),
            name: [this.student_Name],
            phonetics_selection: [this.confirmed_Phonetics],
            // votes: this.votes,
            show: true,
            data_in_votes_table: false,
            audio_selection: this.audion_binary_file_path
          }
        }
        else {
          reqObj = {
            student_id: parseInt(this.student_ID),
            name: [this.student_Name],
            phonetics_selection: [this.edited_phonetics],
            // votes: this.votes,
            show: true,
            data_in_votes_table: false,
            audio_selection: this.audion_binary_file_path
          }
        }

        this.like_button_flag = false
        this.dislike_button_flag = false
        this.savePhonetics(reqObj)
        break;
      }
      default: {
        break;
      }
    }
  }

  // global function to show toaster message
  private displayMessage = (message: string, state: string) => {
    switch (state.toLowerCase()) {
      case 'error':
        this.toastr.error(message, state, {
          closeButton: true,
          progressBar: true
        });
        break;
      case 'info':
        this.toastr.info(message, state, {
          closeButton: true,
          progressBar: true
        });
        break;
      case 'success':
        this.toastr.success(message, state, {
          closeButton: true,
          progressBar: true
        });
        break;
      default:
        break;
    }

  }



  // calling the service from the backend to get the required phonetics.
  private getPhonetics = (reqObj: any) => {
    this.ngxService.start();
    this.httpClient.post('http://127.0.0.1:8081/createpost', reqObj).subscribe(data => {
      let requestedData: any = data
      if (requestedData?.status === "success") {
        this.ngxService.stop();
        this.display_content_card = true;
        this.votes = requestedData?.data?.votes
        let p1 = requestedData?.data?.phonetics
        let p2: any[] = []
        requestedData?.results.forEach((el: any) => {
          p2.push(el?.phonetic)
        })
        this.student_Name = requestedData?.data?.preferred_name
        this.student_pronoun = requestedData?.data?.pronoun

        this.first_name = requestedData?.data?.first_name
        this.last_name = requestedData?.data?.last_name
        this.student_ID = requestedData?.data?.student_id
        this.audion_binary_file_path = requestedData?.data?.audio_binary
        if (p2?.length !== 0 || p2?.length !== undefined || p2?.length !== null) {
          this.listOfPhonetics = p1.concat(p2)
        }
        else {
          this.listOfPhonetics = p1
        }
        this.show_functional_buttons = true
        this.displayMessage('Successful API response.', 'SUCCESS')
      }
      else {
        this.displayMessage(requestedData?.message, 'ERROR')
        this.ngxService.stop();
      }
    })
  }

  private giveUserFeedback = (reqObj: any) => {
    this.ngxService.start();
    this.httpClient.post('http://127.0.0.1:8081/userfeedback', reqObj).subscribe(data => {
      let requestedData: any = data
      if (requestedData?.status === "success") {
        this.ngxService.stop();
        this.tempMsg = true;
        this.displayMessage('Feedback Captured', 'SUCCESS')
      }
      else {
        this.displayMessage(requestedData?.message, 'ERROR')
        this.ngxService.stop();
      }
    })

  }

  private savePhonetics = (reqObj: any) => {
    this.final_phonetics = reqObj?.phonetics_selection
    this.ngxService.start();
    this.httpClient.post('http://127.0.0.1:8081/selection', reqObj).subscribe(data => {
      let requestedData: any = data
      if (requestedData?.status === "success") {
        this.edit_button_flag = true;
        this.ngxService.stop();
        this.displayMessage('Phonetics Saved Successfully', 'SUCCESS')
        this.openDialog()
        // this.feedbackFlag = true;
      }
      else {
        this.displayMessage('Could not process the request', 'ERROR')
        this.ngxService.stop();
      }
    })
  }

}
