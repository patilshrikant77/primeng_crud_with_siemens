import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EmployeeListComponent } from './employee/employee-list/employee-list.component';
import {TableModule} from 'primeng/table';
import {ButtonModule} from 'primeng/button';
import {ConfirmPopupModule} from 'primeng/confirmpopup';
 import {AutoCompleteModule} from 'primeng/autocomplete';
 import { ToastModule } from "primeng/toast";
 import {DialogModule} from 'primeng/dialog';
 import {InputTextareaModule} from 'primeng/inputtextarea';
 import {InputTextModule} from 'primeng/inputtext';
 import {DropdownModule} from 'primeng/dropdown';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    EmployeeListComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    AutoCompleteModule,
    TableModule,
     ButtonModule,
     ConfirmPopupModule,
     ToastModule,
     DialogModule,
     InputTextareaModule,
     InputTextModule,
     DropdownModule
    
  ],
 
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
