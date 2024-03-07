import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-student-delete',
  templateUrl: './student-delete.component.html',
  styleUrls: ['./student-delete.component.scss']
})
export class StudentDeleteComponent {

  public student_id: string = "";

  constructor(
    private toastr: ToastrService,
    private httpClient: HttpClient,
    private ngxService: NgxUiLoaderService,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {

  }

  handleUserAction = (type: string, event: any) => {
switch (type.toLowerCase()) {
  case 'delete':{
    let reqObj = {
      student_id: parseInt(this.student_id)
    }
    this.deleteRecord(reqObj)
  }
}
  }

  private deleteRecord = (reqObj: any) => {
    this.ngxService.start();
    this.httpClient.delete('http://127.0.0.1:8081/deleterecord?student_id=' + parseInt(this.student_id)).subscribe(data => {
      let requestedData: any = data
      if (requestedData?.status === "success") {
        this.ngxService.stop();
        this.displayMessage(requestedData?.message, 'SUCCESS')
        setTimeout(() => {
          window.location.reload()
        }, 4000);
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


}
