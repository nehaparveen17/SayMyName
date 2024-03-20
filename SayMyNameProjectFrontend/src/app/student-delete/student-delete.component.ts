import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { DialogModuleComponent } from '../dialog-module/dialog-module.component';

@Component({
  selector: 'app-student-delete',
  templateUrl: './student-delete.component.html',
  styleUrls: ['./student-delete.component.scss']
})
export class StudentDeleteComponent {

  public student_id: string = "";
  public firstName: string = "";
  public lastName: string = "";
  public preferredName: string = "";
  public pronoun: string = "";
  public phoneticSelection: string = "";
  public display_content_card: boolean = false;

  constructor(
    private toastr: ToastrService,
    private httpClient: HttpClient,
    private ngxService: NgxUiLoaderService,
    public dialog: MatDialog,
    private router: Router
  ) { }

  ngOnInit(): void {

  }

  redirect = () => {
    this.router.navigate(['/'])
  }

  handleUserAction = (type: string, event: any) => {
switch (type.toLowerCase()) {
  case 'delete':{
  this.openDialog()
    break;
  }
  case 'search':{
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
}
  }

  private viewDetails = () => {
    
    let tempStudentID = this.student_id
    this.ngxService.start();
    this.httpClient.get('http://10.28.9.191:8081/getRecord/?studentID=' + parseInt(this.student_id)).subscribe((data: any) => {
      if (data?.status === "success"){
        this.firstName = data?.results[0]?.first_name;
        this.lastName = data?.results[0]?.last_name;
        this.preferredName = data?.results[0]?.preferred_name;
        this.phoneticSelection = data?.results[0]?.phonetics_selection;
        this.pronoun = data?.results[0]?.pronoun;
        this.display_content_card = true;
        this.ngxService.stop();
        this.displayMessage(data?.message, 'SUCCESS')
      }
      else {
        this.ngxService.stop();
        this.student_id = tempStudentID
        this.deleteRecord()
      }
    
    })
  }


  private deleteRecord = () => {
    this.ngxService.start();
    this.httpClient.delete('http://10.28.9.191:8081/deleterecord?student_id=' + parseInt(this.student_id)).subscribe(data => {
      let requestedData: any = data
      if (requestedData?.status === "success") {
        this.ngxService.stop();
        this.displayMessage("Record successfully deleted", 'SUCCESS')
        this.student_id = "";
        setTimeout(() => {
          window.location.reload()
        }, 4000);
        this.display_content_card = false;
      }
      else {
        this.displayMessage(requestedData?.message, 'ERROR')
        this.ngxService.stop();
      }
    })
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

  openDialog(): void {
    let dialogRef = this.dialog.open(DialogModuleComponent, {
      width: '30%',
      data: { flag: "delete-dialog"}
    });

    dialogRef.afterClosed().subscribe(result => {
     if(result === 'Yes'){
      let reqObj = {
        student_id: parseInt(this.student_id)
      } 
      this.deleteRecord()
     } 
    
    });
  }


}