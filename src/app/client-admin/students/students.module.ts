import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentsComponent } from './students.component';
import { StudentsRoutingModule } from './students-routing.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UiSwitchModule } from 'ngx-ui-switch';
//import { FilterByTypePipe } from '../../filter-by-type.pipe';
import { SharedModule } from '../../shared/shared.module';
@NgModule({
  declarations: [StudentsComponent],//,FilterByTypePipe],
  //exports: [FilterByTypePipe],
  imports: [
    CommonModule,
    StudentsRoutingModule,
    NgSelectModule,
    UiSwitchModule.forRoot({
      size: 'small',
      color: 'rgb(0, 189, 99)',
      switchColor: '#ffffff',
      defaultBgColor: '#cccccc',
      defaultBoColor : '#476EFF',
      checkedLabel: 'Active',
      uncheckedLabel: 'InActive'
    }),
    FormsModule, // Template-driven forms
    ReactiveFormsModule, // Reactive forms
    SharedModule
  ]
})
export class StudentsModule {}
