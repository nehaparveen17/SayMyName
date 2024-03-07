import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-module',
  templateUrl: './dialog-module.component.html',
  styleUrls: ['./dialog-module.component.scss']
})
export class DialogModuleComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogModuleComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }
 
  onCancel(): void {
    this.dialogRef.close();
  }
}
