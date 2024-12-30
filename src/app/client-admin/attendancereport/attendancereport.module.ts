import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AttendancereportComponent } from './attendancereport.component';
import { AttendancereportRoutingModule } from './attendancereport-routing.module';
//import { FilterByTypePipe } from '../../filter-by-type.pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { UiSwitchModule } from 'ngx-ui-switch';
import { NgbCalendar, NgbDate, NgbDateParserFormatter, NgbDatepickerModule,NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { JsonPipe } from '@angular/common';
@NgModule({
  declarations: [AttendancereportComponent],//, FilterByTypePipe],
  //exports: [FilterByTypePipe],
  imports: [
    CommonModule,
    AttendancereportRoutingModule,
    FormsModule, // Template-driven forms
    ReactiveFormsModule, // Reactive forms
    SharedModule,
    UiSwitchModule.forRoot({
      size: 'small',
      color: 'rgb(0, 189, 99)',
      switchColor: '#ffffff',
      defaultBgColor: '#cccccc',
      defaultBoColor: '#476EFF',
      checkedLabel: 'Active',
      uncheckedLabel: 'InActive'
    }),
    NgbDatepickerModule, FormsModule, JsonPipe,
    NgbPaginationModule
  ]
})
export class AttendancereportModule { }
