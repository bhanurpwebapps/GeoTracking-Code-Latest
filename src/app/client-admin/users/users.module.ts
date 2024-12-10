import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersComponent } from './users.component';
import { UsersRoutingModule } from './users-routing.module';
import { UiSwitchModule } from 'ngx-ui-switch';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [UsersComponent],
  imports: [
    CommonModule,
    UsersRoutingModule,
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
export class UsersModule { }
