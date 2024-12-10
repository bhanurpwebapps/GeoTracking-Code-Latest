import { Routes } from '@angular/router';
import { AuthGuard } from 'src/app/auth/auth.guard';



export const CommonLayout_ROUTES: Routes = [
    {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',    
   
  },

  // Product Admin Route

  {
    path: 'dashboard-productadmin',
    loadChildren: () => import('../../product-admin/dashboard-productadmin/dashboard-productadmin.module').then(m => m.DashboardProductadminModule),
    canActivate:[AuthGuard]
  },

  {
    path: 'clients',
    loadChildren: () => import('../../product-admin/clients/clients.module').then(m => m.ClientsModule),  
    canActivate:[AuthGuard] 
  },
  // Product Admin Route End

  // Clients  Route
  {
    path: 'dashboard-client',
    loadChildren: () => import('../../client-admin/dashboard-client/dashboard-client.module').then(m => m.DashboardClientModule),  
    canActivate:[AuthGuard] 
  },

  {
    path: 'users',
    loadChildren: () => import('../../client-admin/users/users.module').then(m => m.UsersModule),   
    canActivate:[AuthGuard]
  },

  {
    path: 'areas',
    loadChildren: () => import('../../client-admin/areas/areas.module').then(m => m.AreasModule),   
    canActivate:[AuthGuard]
  },

  {
    path: 'gateways',
    loadChildren: () => import('../../client-admin/gateways/gateways.module').then(m => m.GatewaysModule), 
    canActivate:[AuthGuard]  
  },

  {
    path: 'badges',
    loadChildren: () => import('../../client-admin/badges/badges.module').then(m => m.BadgesModule),  
    canActivate:[AuthGuard] 
  },

  {
    path: 'students',
    loadChildren: () => import('../../client-admin/students/students.module').then(m => m.StudentsModule), 
    canActivate:[AuthGuard]  
  },

  {
    path: 'attendance',
    loadChildren: () => import('../../client-admin/attendance/attendance.module').then(m => m.AttendanceModule),  
    canActivate:[AuthGuard] 
  },
  {
    path: 'settings',
    loadChildren: () => import('../../client-admin/settings/settings.module').then(m => m.SettingsModule),  
    canActivate:[AuthGuard] 
  },
  // Clients Route End

];




