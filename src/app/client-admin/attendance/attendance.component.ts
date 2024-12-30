import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { AreaService } from 'src/app/shared/services/area.service';
import { AttendanceService } from 'src/app/shared/services/attendance.service';
import { SocketService } from 'src/app/shared/services/socket.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.css']
})
export class AttendanceComponent {

  attendanceList: any[] = [];
  areas: any[] = [];
  user: any;
  area: any = null;
  attSearchquery:any=null;
  private attendanceSubject = new BehaviorSubject<any[]>([]);
  constructor(private attendanceService: AttendanceService, private userService: UserService, private areaService: AreaService, private socketService: SocketService,private router: Router) {

    this.userService.user$.subscribe((user) => {
      this.user = user.user; // Update user info dynamically
    });
  }


  ngOnInit(): void {

    this.loadAttendance(this.user.clientId, null, this.attSearchquery, this.attSearchquery);
    this.loadAreas(this.user.clientId);
    this.socketService.onStudentTrackingStatus().subscribe((status) => {
      console.log('Received Student Device status:', status);
      this.updateStudentStatus(status);
    });
  }

  // Load all areas
  loadAttendance(clientId: any, areaId: any, deviceId: any, studentId: any): void {
    this.attendanceService.getTodaysAttendance(clientId, areaId, deviceId, studentId).subscribe(
      (data) => {
        this.attendanceList = data.data;
        console.log(this.attendanceList)
        this.attendanceSubject.next(this.attendanceList);
      },
      (error) => {
        console.error('Error fetching attendance list:', error);
      }
    );
  }

  // Load all areas
  loadAreas(clientId: any): void {
    this.areaService.getAreas(clientId).subscribe(
      (data) => {
        this.areas = data;
        console.log(this.areas)
      },
      (error) => {
        console.error('Error fetching areas:', error);
      }
    );
  }

  onSelectionChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    console.log('Selected Value:', target.value);
    if (target.value != "null") {
      this.area = target.value;
    }
    else {
      this.area = null;
    }
    this.loadAttendance(this.user.clientId, this.area, this.attSearchquery, this.attSearchquery);
    // Perform any additional logic here
  }

   // Triggered when the Gateways types in the search field
   onKeySearch() {
    this.loadAttendance(this.user.clientId, this.area, this.attSearchquery, this.attSearchquery);
  }

  // Update gateway status
  private updateStudentStatus(newStatus: any) {

    const currentStudentData = this.attendanceSubject.getValue();
    const updatedGateways = currentStudentData.map(student =>
      student.bleDeviceId === newStatus.deviceId.toUpperCase() ? { ...student, attendanceStatus: newStatus.attendanceStatus, areaName: newStatus.areaName, areaType: newStatus.areaType, lastDetectionTime: newStatus.lastDetectionTime } : student
    );
    this.attendanceSubject.next(updatedGateways);

    this.attendanceList = this.attendanceSubject.getValue();
  }

  navigatezToAttendanceTrackOfTheDay(deviceId:any,studentRegistrationNo:any) {
    this.router.navigate(['/viewattendance'], { 
      queryParams: { deviceId: deviceId,studentRegistrationNo : studentRegistrationNo}
    });
  }

}
