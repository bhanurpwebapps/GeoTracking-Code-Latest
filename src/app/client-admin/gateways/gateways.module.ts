import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GatewaysComponent } from './gateways.component';
import { GatewaysRoutingModule } from './gateways-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UiSwitchModule } from 'ngx-ui-switch';

@NgModule({
  declarations: [GatewaysComponent],
  imports: [
    CommonModule,
    GatewaysRoutingModule,
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
export class GatewaysModule { }
