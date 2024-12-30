import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductAdminRoutingModule } from './product-admin-routing.module';
import { DashboardProductadminComponent } from './dashboard-productadmin/dashboard-productadmin.component';
//import { ClientsComponent } from './clients/clients.component';
//import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    //DashboardProductadminComponent

  ],
  imports: [
    CommonModule,
    ProductAdminRoutingModule
    
  ]
})
export class ProductAdminModule { }
