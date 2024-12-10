import { NgModule } from '@angular/core';
import { CommonModule, JsonPipe  } from '@angular/common';
import { SettingsComponent } from './settings.component';
import { SettingsRoutingModule } from './settings-routing.module';
import {NgbTimepickerModule, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
@NgModule({
  declarations: [SettingsComponent],
  imports: [
    CommonModule,
    SettingsRoutingModule,
    NgbTimepickerModule,
    JsonPipe,
    NgbModule,
    FormsModule, // Template-driven forms
    ReactiveFormsModule, // Reactive forms
  ]
})
export class SettingsModule { }
