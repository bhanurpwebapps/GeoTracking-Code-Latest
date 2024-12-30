import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AttendanceComponent } from './attendance.component';
import { AttendanceRoutingModule } from './attendance-routing.module';
//import { FilterByTypePipe } from '../../filter-by-type.pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
@NgModule({
  declarations: [AttendanceComponent],//, FilterByTypePipe],
  //exports: [FilterByTypePipe],
  imports: [
    CommonModule,
    AttendanceRoutingModule,
    FormsModule, // Template-driven forms
    ReactiveFormsModule, // Reactive forms
    SharedModule
  ]
})
export class AttendanceModule { }
