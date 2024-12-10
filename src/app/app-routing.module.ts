import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FullLayout_ROUTES } from './shared/routes/full-layout.routes';
import { FullLayoutComponent } from './layouts/full-layout/full-layout.component';
import { CommonLayout_ROUTES } from './shared/routes/common-layout.routes';
import { CommonLayoutComponent } from './layouts/common-layout/common-layout.component';
// import { AuthGuard } from './shared/services/auth.guard';

import { DashboardClientComponent } from './client-admin/dashboard-client/dashboard-client.component';
import{DashboardProductadminComponent} from './product-admin/dashboard-productadmin/dashboard-productadmin.component'
const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard-productadmin',
    pathMatch: 'full',
  },

  // {
  //   path: '',
  //   redirectTo: '/dashboard-client',
  //   pathMatch: 'full',
  // },

  {
    path: 'login',
    component: FullLayoutComponent ,
    children: FullLayout_ROUTES
  },

  {
    path: 'signup',
    loadChildren: () => import('./auth/signup/signup.module').then(m => m.SignupModule),
  },

  {
    path: '',
    component: CommonLayoutComponent,
    children: CommonLayout_ROUTES
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
