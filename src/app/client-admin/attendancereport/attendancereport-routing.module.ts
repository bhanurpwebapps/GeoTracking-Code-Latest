import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AttendancereportComponent } from './attendancereport.component';
const routes: Routes = [
  {
    path: "",
    component: AttendancereportComponent ,
   
   },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AttendancereportRoutingModule { }
