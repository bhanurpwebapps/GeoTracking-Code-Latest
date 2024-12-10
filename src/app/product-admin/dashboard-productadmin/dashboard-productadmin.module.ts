import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardProductadminComponent } from './dashboard-productadmin.component';
import { DashboardProductadminRoutingModule } from './dashboard-productadmin-routing.module';


@NgModule({
  declarations: [DashboardProductadminComponent],
  imports: [
    CommonModule,
    DashboardProductadminRoutingModule
  ]
})
export class DashboardProductadminModule { }
