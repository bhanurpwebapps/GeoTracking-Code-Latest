import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardProductadminComponent } from './dashboard-productadmin.component';

const routes: Routes = [
  {
    path: "",
    component: DashboardProductadminComponent,
   
   },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardProductadminRoutingModule { }
