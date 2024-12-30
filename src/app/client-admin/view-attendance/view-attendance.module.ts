import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViewAttendanceRoutingModule } from './view-attendance-routing.module';
import { JsonPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ViewAttendanceComponent } from './view-attendance.component';
import {NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
@NgModule({
  declarations: [ViewAttendanceComponent],
  imports: [
    CommonModule,
    ViewAttendanceRoutingModule,
    JsonPipe,
    FormsModule, // Template-driven forms
    ReactiveFormsModule, // Reactive forms
    NgbPaginationModule
  ]
})
export class ViewAttendanceModule { }
