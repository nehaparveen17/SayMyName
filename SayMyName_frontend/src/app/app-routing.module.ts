import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MainComponent } from './main/main.component';
import { StudentEditViewComponent } from './student-edit-view/student-edit-view.component';
import { StudentDeleteComponent } from './student-delete/student-delete.component';


const routes: Routes = [
  {path: '', component: MainComponent},
  {path: 'student-delete', component: StudentDeleteComponent},
  {path: 'student-edit-view', component: StudentEditViewComponent}
 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
