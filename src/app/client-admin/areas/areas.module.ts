import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AreasComponent } from './areas.component';
import { AreasRoutingModule } from './areas-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UiSwitchModule } from 'ngx-ui-switch';

@NgModule({
  declarations: [AreasComponent],
  imports: [
    CommonModule,
    AreasRoutingModule,
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
  ]
})
export class AreasModule { }
