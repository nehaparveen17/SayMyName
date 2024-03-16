import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Router } from '@angular/router';
import {MatSelectChange} from '@angular/material/select';
import { DialogModuleComponent } from '../dialog-module/dialog-module.component';

@Component({
  selector: 'app-student-edit-view',
  templateUrl: './student-edit-view.component.html',
  styleUrls: ['./student-edit-view.component.scss']
})
export class StudentEditViewComponent {

  public student_id: string = "";
  public firstName: string = "";
  public lastName: string = "";
  public preferredName: string = "";
  public pronoun: string = "";
  public phoneticSelection: string = "";
  public display_content_card: boolean = false;
  public view_first_name_flag: boolean = false;
  public edited_first_name: any = undefined;
  public view_last_name_flag: boolean = false;
  public edited_last_name: any = undefined;
  public view_preferred_name_flag: boolean = false;
  public edited_preferred_name: any = undefined;
  public view_phonetics_flag: boolean = false;
  public edited_phonetics_name: any = undefined;
  public view_pronoun_flag: boolean = false;
  public edited_pronoun: any = undefined;
  public update_button_flag: boolean = true;
  public listOfPronouns = [
    { value: '01', viewValue: 'She / Her' },
    { value: '02', viewValue: 'He / Him' },
    { value: '03', viewValue: 'They / Them' },
    { value: '04', viewValue: 'Prefer Not to Say' },
    { value: '05', viewValue: 'Not included in the list' },
  ];

  constructor(
    private toastr: ToastrService,
    private httpClient: HttpClient,
    private ngxService: NgxUiLoaderService,
    public dialog: MatDialog,
    private router: Router
  ) { }

  ngOnInit(): void {

  }

  pronounChanged = (event: MatSelectChange) => {
    this.update_button_flag = false
    if (event?.value === 'Not included in the list') {
      this.openDialogForPronoun()
    }
  }

  openDialogForPronoun(): void {
    let dialogRef = this.dialog.open(DialogModuleComponent, {
      width: '30%',
      data: { flag: "pronoun-dialog-from-edit-view" }
    });
    this.listOfPronouns = this.listOfPronouns.filter((ele: any) => {
      return ele?.value !== 'userAdded'
    })
    dialogRef.afterClosed().subscribe(result => {
      if(result === 'No'){
        this.edited_pronoun = ''
       }
       else {
        this.listOfPronouns.push({ value: 'userAdded', viewValue: result })
        this.listOfPronouns.forEach((ele:any) => {
          if(ele?.value === 'userAdded'){
            this.edited_pronoun = ele?.viewValue
          }
        })
       } 
    });
  }

  redirect = () => {
    this.router.navigate(['/'])
  }

  handleUserAction = (type: string, event: any) => {
    switch (type.toLowerCase()) {
      case 'view': {
        if (/^\d+$/.test(this.student_id)) {
          if (this.student_id?.length == 9 ) {
            this.viewDetails()
          }
          else {
            this.displayMessage('Student ID should be of 9 digits', 'ERROR')
            this.student_id = "";
          }
        }
        else {
          this.displayMessage('Student ID should be in number only', 'ERROR')
          this.student_id = "";
        }
        break;
      }
      case 'edit_first_name': {
        this.edited_first_name = this.firstName;
        this.view_first_name_flag = true;
        break;
      }
      case 'edit_last_name': {
        this.edited_last_name = this.lastName;
        this.view_last_name_flag = true;
        break;
      }
      case 'edit_preferred_name': {
        this.edited_preferred_name = this.preferredName;
        this.view_preferred_name_flag = true;
        break;
      }
      case 'edit_phonetics': {
        this.edited_phonetics_name = this.phoneticSelection;
        this.view_phonetics_flag = true;
        break;
      }
      case 'edit_pronoun': {
        this.edited_pronoun = this.phoneticSelection;
        this.view_pronoun_flag = true;
        break;
      }
      case 'update': {
        let reqObj = {
          "student_id": parseInt(this.student_id),
          "first_name": this.edited_first_name || this.firstName,
          "pronoun": this.edited_pronoun || this.pronoun,
          "last_name": this.edited_last_name || this.lastName,
          "preferred_name": this.edited_preferred_name || this.preferredName,
          "course": "AIGS",
          "intake": "Fall",
          "year": 2023,
          "phonetics_selection": this.edited_phonetics_name || this.phoneticSelection
        }
        console.log(reqObj)
        this.updateDetails(reqObj);
        break;
      }
    }
  }

  // change(event: any) {
  //   this.update_button_flag = false
  // }

  sendTheNewFirstNameValue(event: any) {
    let value: any
    value = event?.target?.value;
    let emp: any
    if (value == '' || value == undefined || value == null) {
      emp = this.firstName;
      this.update_button_flag = true
    }
    else {
      emp = value
      this.update_button_flag = false
    }

  }

  sendTheNewLastNameValue(event: any) {
    let value: any
    value = event?.target?.value;
    let emp: any
    if (value == '' || value == undefined || value == null) {
      emp = this.lastName;
      this.update_button_flag = true
    }
    else {
      emp = value
      this.update_button_flag = false
    }
  }

  sendTheNewPreferredNameValue(event: any) {
    let value: any
    value = event?.target?.value;
    let emp: any
    if (value == '' || value == undefined || value == null) {
      emp = this.preferredName;
      this.update_button_flag = true
    }
    else {
      emp = value
      this.update_button_flag = false
    }
  }

  sendTheNewPhoneticsNameValue(event: any) {
    let value: any
    value = event?.target?.value;
    let emp: any
    if (value == '' || value == undefined || value == null) {
      emp = this.phoneticSelection;
      this.update_button_flag = true
    }
    else {
      emp = value
      this.update_button_flag = false
    }
  }


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

  private viewDetails = () => {
    this.ngxService.start();
    this.httpClient.get('http://127.0.0.1:8081/getRecord/?studentID=' + parseInt(this.student_id)).subscribe((data: any) => {
      if (data?.status === "success"){
        this.firstName = data?.results[0]?.first_name;
        this.lastName = data?.results[0]?.last_name;
        this.preferredName = data?.results[0]?.preferred_name;
        this.phoneticSelection = data?.results[0]?.phonetics_selection;
        this.pronoun = data?.results[0]?.pronoun;
        this.display_content_card = true;
        this.ngxService.stop();
        this.displayMessage("Successfully record fetched ", 'SUCCESS')
      }
      else {
        this.ngxService.stop();
        this.displayMessage(data?.message, 'ERROR')
      }

    })
  }

  private updateDetails = (reqObj: any) => {
    this.ngxService.start();
    this.httpClient.put("http://127.0.0.1:8081/update", reqObj).subscribe((data: any) => {
      if (data?.status.toLowerCase() === "success") {
        this.ngxService.stop();
        this.displayMessage(data?.message, 'SUCCESS');
        this.student_id = "";
        this.display_content_card = false;
        this.listOfPronouns = this.listOfPronouns.filter((ele: any) => {
          return ele?.value !== 'userAdded'
        })
        setTimeout(() => {
          window.location.reload()
        }, 4000);
      }
      else {
        this.ngxService.stop();
        this.displayMessage(data?.message, 'ERROR')
      }

    })
  }

}