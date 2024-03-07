import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainComponent } from './main/main.component';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import {MatIconModule} from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import {MatCardModule} from '@angular/material/card';
import { ToastrModule, provideToastr } from 'ngx-toastr';
import { HttpClientModule } from '@angular/common/http';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import {MatSelectModule} from '@angular/material/select';
import {MatRadioModule} from '@angular/material/radio';
import {MatInputModule} from '@angular/material/input';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatButtonModule} from '@angular/material/button';
import {MatDialogModule} from '@angular/material/dialog';
import { DialogModuleComponent } from './dialog-module/dialog-module.component';
import { StudentDeleteComponent } from './student-delete/student-delete.component';
import { StudentEditViewComponent } from './student-edit-view/student-edit-view.component';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    DialogModuleComponent,
    StudentDeleteComponent,
    StudentEditViewComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatIconModule,
    FormsModule,
    MatCardModule,
    MatSelectModule,
    MatGridListModule,
    NgxUiLoaderModule,
    MatTooltipModule,
    MatRadioModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    ToastrModule.forRoot(), // ToastrModule added
  ],
  providers: [
    provideAnimations(), // required animations providers
    provideToastr(), // Toastr providers
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
