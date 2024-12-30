import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { AttendanceService } from 'src/app/shared/services/attendance.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-view-attendance',
  templateUrl: './view-attendance.component.html',
  styleUrls: ['./view-attendance.component.css']
})
export class ViewAttendanceComponent {
  deviceId: string | null = null;
  studentRegNo : string | null = null;
  attendanceList: any[] = [];
  user: any;
  totalRecords: any;
  pageNo: any=1;
  pageSize: any=10;
  totalPages: any;;

  constructor(private route: ActivatedRoute,private attendanceService: AttendanceService, private userService: UserService,private router: Router) {
    this.userService.user$.subscribe((user) => {
      this.user = user.user; // Update user info dynamically
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.deviceId = params['deviceId'];
      this.studentRegNo = params['studentRegistrationNo'];   
     // const fromDate = this.convertToDate(this.fromDate);
     // const toDate = this.convertToDate(this.toDate);
      let Obj = {
        //"fromDate": "2024-12-01",//fromDate?.toLocaleDateString(),
        //"toDate": "2024-12-20",//toDate?.toLocaleDateString(),
        "clientId": this.user.clientId,
        "deviceId": this.deviceId ,
        "studentId":this.studentRegNo,
        "pageSize":this.pageSize,
        "pageNo":1
    }
       this.pageNo=1;
       this.loadAttendance(Obj);
      
      this.loadAttendance(Obj);
    });
   
  }

   convertToDate(ngbDate: NgbDateStruct | null): Date | null {
        if (!ngbDate) {
          console.warn('NgbDateStruct is null or undefined');
          return null;
        }
        return new Date(ngbDate.year, ngbDate.month - 1, ngbDate.day); // Month is 0-based
      }

   // Load all areas
   loadAttendance(payload:any): void {
    this.attendanceService.todaystudenttrack(payload).subscribe(
      (data) => {
        this.attendanceList = data.data;
        this.totalPages = data.pagination.totalRecords;
        console.log(this.attendanceList);

      },
      (error) => {
        console.error('Error fetching attendance list:', error);
      }
    );
  }

  onPageChange(pageNo: number) {
    //const fromDate = this.convertToDate(this.fromDate);
     // const toDate = this.convertToDate(this.toDate);
      let Obj = {
        //"fromDate": "2024-12-01",//fromDate?.toLocaleDateString(),
        //"toDate": "2024-12-20",//toDate?.toLocaleDateString(),
        "clientId": this.user.clientId,
        "deviceId": this.deviceId ,
        "studentId":this.studentRegNo,
        "pageSize":this.pageSize,
        "pageNo":pageNo
    }
  
    this.loadAttendance(Obj);    
  }

  backtoattendance() {
    this.router.navigate(['/attendance'], { 
    });
  };

}
