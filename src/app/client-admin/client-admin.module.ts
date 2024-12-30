import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientAdminRoutingModule } from './client-admin-routing.module';
import { DashboardClientComponent } from './dashboard-client/dashboard-client.component';
import { ViewAttendanceComponent } from './view-attendance/view-attendance.component';
//import { UsersComponent } from './users/users.component';
// import { AreasComponent } from './areas/areas.component';
// import { GatewaysComponent } from './gateways/gateways.component';
// import { BadgesComponent } from './badges/badges.component';
// import { StudentsComponent } from './students/students.component';
// import { AttendanceComponent } from './attendance/attendance.component';
// import { SettingsComponent } from './settings/settings.component';
// import { AttendancereportComponent } from './attendancereport/attendancereport.component';

@NgModule({
  declarations: [
    DashboardClientComponent,
    //ViewAttendanceComponent,
    //AttendancereportComponent,
    //UsersComponent,
    //AreasComponent,
    //GatewaysComponent,
    //BadgesComponent,
    //StudentsComponent,
    //AttendanceComponent,
    //SettingsComponent
  ],
  imports: [
    CommonModule,
    ClientAdminRoutingModule
  ]
})
export class ClientAdminModule { }
