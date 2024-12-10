import { Component } from '@angular/core';
import { AuthService } from '../auth.service';  // Import your AuthService
import { Router } from '@angular/router';  // To navigate after login
import { UserService } from 'src/app/shared/services/user.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  loginError: string | null = null;

  constructor( private router: Router,private authService:AuthService,private userService:UserService,private toastr: NotificationService) { }

  login() {
   this.authService.login(this.username, this.password).subscribe(
      (response) => {
        // On success, store the token and navigate to the dashboard
        this.authService.setToken(response.token);
        this.userService.setUser(response);
        this.toastr.showSuccess("Login Successfully", "Success");
        //console.log(response);
        if(response.user.userType!=="ClientUser")
        {
         this.router.navigate(['/dashboard-productadmin']);  // Navigate to the dashboard after successful login
        }
        else
        {
          this.router.navigate(['/dashboard-client']);  // Navigate to the dashboard after successful login
        }
      },
      (error) => {
        // On error, display the error message
        this.loginError = 'Invalid username or password. Please try again.';
        this.toastr.showError(this.loginError, "Error");
      }
    );
    
  }
}
