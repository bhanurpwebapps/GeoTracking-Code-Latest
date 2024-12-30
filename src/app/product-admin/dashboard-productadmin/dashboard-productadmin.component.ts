import { Component } from '@angular/core';
import { DashboardService } from 'src/app/shared/services/dashboard.service';
import { UserService } from 'src/app/shared/services/user.service';
@Component({
  selector: 'app-dashboard-productadmin',
  templateUrl: './dashboard-productadmin.component.html',
  styleUrls: ['./dashboard-productadmin.component.css']
})
export class DashboardProductadminComponent {
  user: any;
  summaryData:any;
  constructor(private dashboardServcie: DashboardService, private userService: UserService) {
    this.userService.user$.subscribe((user) => {
      this.user = user.user; // Update user info dynamically
    });

  }

  ngOnInit(): void {
    this.loadSummaryCount(null);
  }


  // Load all areas
  loadSummaryCount(clientId: any): void {
    this.dashboardServcie.AppAdminDataSummaryCount(clientId).subscribe(
      (data) => {
        this.summaryData = data;
      },
      (error) => {
        console.error('Error fetching Gateways,Areas, Students Count:', error);
      }
    );
  }

}
