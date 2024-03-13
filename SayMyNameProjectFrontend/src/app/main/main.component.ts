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
import { Router } from '@angular/router';
import { MatRadioChange } from '@angular/material/radio';

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
  public show_save_button: boolean = false;
  public show_edit_button: boolean = false;
  public value: string = ''
  public save_button_flag: boolean = false;
  public display_content_card_for_view_only: boolean = false
  public phonetics_selection: string = ''
  public play_audio_button: boolean = false
  public play_audio_button_flag: boolean = false
  public get_audio_for_phonetics: string = ""
  public submit_button_flag: boolean = false

  constructor(private domSanitizer: DomSanitizer,
    private toastr: ToastrService,
    private httpClient: HttpClient,
    private ngxService: NgxUiLoaderService,
    public dialog: MatDialog,
    private router: Router
  ) { }

  ngOnInit(): void {

  }



  openDialog(): void {
    let dialogRef = this.dialog.open(DialogModuleComponent, {
      width: '30%',
      data: { flag: "view-dialog", studentId: this.student_ID, preferredName: this.student_Name, Phonetics: this.final_phonetics }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.feedbackFlag = true;
    });
  }

  sendTheNewValue(event: any) {
    this.value = event?.target?.value;
    if (this.value !== '' || this.value !== undefined || this.value !== null) {
      this.show_save_button = true;
      this.play_audio_button = true;
    }
    if (this.value == '' || this.value == undefined || this.value == null) {
      this.show_save_button = false;
      this.play_audio_button = false;
    }
    this.get_audio_for_phonetics = this.value?.toLowerCase()
  }


  playAudio(): void {
    // Append the student name to the API URL as a query parameter
    const apiUrl = `http://127.0.0.1:8081/getaudio?preferred_name=` + this.get_audio_for_phonetics;

    // Send a GET request to your backend API to generate and play the audio
    this.httpClient.get(apiUrl, { responseType: 'blob' })
      .subscribe(
        (response: any) => {
          // Create a blob URL from the audio data received
          const blob = new Blob([response], { type: 'audio/wav' });
          const url = window.URL.createObjectURL(blob);

          // Create an audio element and set its source to the blob URL
          const audio = new Audio();
          audio.src = url;

          // Play the audio
          this.ngxService.stop();
          setTimeout(() => {
            this.ngxService.stop()
            audio.play();
          }, 1000);
         
        },
        error => {
          console.error('Error playing audio:', error);
          // Handle error as needed
        }
      );
    // delete the above
  }

  public change = (event: MatRadioChange) => {
    if(event?.value !== null || event?.value !== undefined || event?.value !== ''){
      this.play_audio_button = true;
        this.show_save_button = true
        this.get_audio_for_phonetics = event?.value.toLowerCase();
    }
  }



  // this method handles the user action from the user interface
  public handleUserAction = (type: string, event: any) => {
    switch (type.toLowerCase()) {
      case 'search': {
        this.display_content_card = false;
        this.display_content_card_for_view_only = false;
        // if ((this.student_ID !== '' || this.student_ID !== null || this.student_ID !== undefined) && (/^\d+$/.test(this.student_ID)) && this.student_ID?.length == 9 && this.student_pronoun == '' && this.student_Name == '' && this.first_name == '' && this.last_name == '') {

        //   this.viewDetails()
        // }
        // else {
          if (this.student_ID == ''){
            this.displayMessage('Please enter the student ID', 'ERROR')
          }
          else {
            if (/^\d+$/.test(this.student_ID)) {
              if (this.student_ID?.length == 9) {
                if(this.student_pronoun !== ''){
                  if(this.student_Name !== ''){
                    if (/^[a-zA-Z ]*$/.test(this.student_Name)) {
                      if(this.first_name !== ''){
                        if (/^[a-zA-Z ]*$/.test(this.first_name)) {
                          // if(this.last_name !== ''){
                          //   if (/^[a-zA-Z ]*$/.test(this.last_name)) {
                              let pronoun = ''
                              this.listOfPronouns.forEach((ele: any) => {
                                if (ele?.value === this.student_pronoun) {
                                  pronoun = ele?.viewValue
                                }
                              })
                              if (this.last_name === ''){
                                this.last_name = 'No Last Name'
                              }
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
                          //   }
                          //   else {
                          //     this.displayMessage('Last Name can only contain lower and uppercase alphabets including space.', 'ERROR')
                          //   }
                          // }
                          // else {
                          //   this.displayMessage('Please enter the last name.', 'ERROR')
                          // }
                         
                        }
                        else {
                          this.displayMessage('First Name can only contain lower and uppercase alphabets including space.', 'ERROR')
                        }
                      }
                      else {
                        this.displayMessage('Please enter the first name.', 'ERROR')
                      }
                     
    
                    }
                    else {
                      this.displayMessage('Preferred Name can only contain lower and uppercase alphabets including space.', 'ERROR')
                    }
                  }
                  else {
                    this.displayMessage('Please enter the preferred name.', 'ERROR')
                  }
                 
                }
                else {
                  this.displayMessage('Please enter the pronoun.', 'ERROR')
                }
                    
              }
              else {
                this.displayMessage('Student ID should be of 9 digits', 'ERROR')
              }
            }
            else {
              this.displayMessage('Student ID should be in number only', 'ERROR')
            }
          // }
        }
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
        if (this.value !== '') {
          this.show_save_button = true
        }
        break;
      }
      case 'phoneticsChanged': {
        console.log(event)
        this.edited_phonetics = event.value;
        // this.show_functional_buttons = true;
        this.play_audio_button = true;
        this.get_audio_for_phonetics = this.edited_phonetics.toLowerCase();
        this.show_save_button = true
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
            data_in_votes_table: this.votes,
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
            data_in_votes_table: this.votes,
            audio_selection: this.audion_binary_file_path
          }
        }

        this.like_button_flag = false
        this.dislike_button_flag = false
        this.savePhonetics(reqObj)
        break;
      }
      case 'delete': {
        this.router.navigate(['/student-delete'])
        break;
      }
      case 'view-edit': {
        this.router.navigate(['/student-edit-view'])
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
    this.httpClient.post('http://127.0.0.1:8081/createpost', reqObj).subscribe((data:any)=> {
      let requestedData: any = data
      if (requestedData?.status === "success") {
        this.ngxService.stop();
        this.display_content_card = true;
        this.votes = requestedData?.data?.data_in_votes_table
        let p1 = requestedData?.data?.phonetics
        let p2: any[] = []
        requestedData?.results.forEach((el: any) => {
          p2.push(el?.phonetic)
        })
        this.student_Name = requestedData?.data?.preferred_name
        let pronoun = requestedData?.data?.pronoun
        this.listOfPronouns.forEach((ele: any) => {
          if (ele?.viewValue === pronoun) {
            this.student_pronoun = ele?.value
          }
        })
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
        this.show_edit_button = true;
        this.play_audio_button = false;
        this.submit_button_flag = true;
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
    this.httpClient.post('http://127.0.0.1:8081/userfeedback', reqObj).subscribe((data:any) => {
      let requestedData: any = data
      if (requestedData?.status === "success") {
        this.ngxService.stop();
        this.tempMsg = true;
        this.displayMessage('Feedback Captured', 'SUCCESS')
        this.like_button_flag = true
        this.dislike_button_flag = true
        setTimeout(() => {
          window.location.reload()
        }, 5000);
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
    this.httpClient.post('http://127.0.0.1:8081/selection', reqObj).subscribe((data:any) => {
      let requestedData: any = data
      if (requestedData?.status === "success") {
        this.edit_button_flag = true;
        this.play_audio_button_flag = true;
        this.ngxService.stop();
        this.displayMessage('Phonetics Saved Successfully', 'SUCCESS')
        this.openDialog()
        // this.feedbackFlag = true;
        this.save_button_flag = true;
      }
      else {
        this.displayMessage('Could not process the request', 'ERROR')
        this.ngxService.stop();
      }
    })
  }


  // private viewDetails = () => {
  //   this.ngxService.start();
  //   this.httpClient.get('http://127.0.0.1:8081/getRecord/?studentID=' + parseInt(this.student_ID)).subscribe((data: any) => {
  //    if(data?.status === "success"){
  //     this.listOfPronouns.forEach((ele: any) => {
  //       let pronoun = data?.results[0]?.pronoun
  //       if (ele?.viewValue === pronoun) {
  //         this.student_pronoun = ele?.value
  //       }
  //     })
  //     this.first_name = data?.results[0]?.first_name
  //     this.last_name = data?.results[0]?.last_name
  //     this.student_Name = data?.results[0]?.preferred_name
  //     this.phonetics_selection = data?.results[0]?.phonetics_selection
  //     this.ngxService.stop();
  //     this.displayMessage("Sucessfully record fetched", 'SUCCESS')
  //     this.get_audio_for_phonetics = this.phonetics_selection
  //     this.play_audio_button = true
  //     this.display_content_card_for_view_only = true;
  //    }
  //    else {
  //     this.ngxService.stop();
  //     this.displayMessage(data?.message, 'ERROR')
  //    }
      
  //   })
  // }

}