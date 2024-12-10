import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    debugger;
    if (this.authService.getToken()) {
      return true; // Allow route activation
    } else {
      this.router.navigate(['/login']); // Redirect to login page
      return false;
    }
  }
}
