import { Routes, RouterModule } from '@angular/router';

export const FullLayout_ROUTES: Routes = [
  
  {
    path: '',
    loadChildren: () => import('../../auth/auth.module').then(m => m.AuthModule),
  },
 
];
