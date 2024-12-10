import { Component } from '@angular/core';
import { UserService } from './shared/services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'geo-traking';
  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getUser(); // Load user info from localStorage
  }
}
