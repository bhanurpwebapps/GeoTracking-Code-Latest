import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BadgesComponent } from './badges.component';
import { BadgesRoutingModule } from './badges-routing.module';
import { UiSwitchModule } from 'ngx-ui-switch';

@NgModule({
  declarations: [BadgesComponent],
  imports: [
    CommonModule,
    BadgesRoutingModule,
    UiSwitchModule.forRoot({
      size: 'small',
      color: 'rgb(0, 189, 99)',
      switchColor: '#ffffff',
      defaultBgColor: '#cccccc',
      defaultBoColor : '#476EFF',
      checkedLabel: 'Active',
      uncheckedLabel: 'Inactive'
    })
  ]
})
export class BadgesModule { }
