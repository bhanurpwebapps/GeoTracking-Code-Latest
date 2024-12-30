
import { AreaService } from 'src/app/shared/services/area.service';
import { UserService } from 'src/app/shared/services/user.service';
import { Component, inject } from '@angular/core';
import { NgbCalendar, NgbDate, NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { AttendanceService } from 'src/app/shared/services/attendance.service';
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';
@Component({
  selector: 'app-attendancereport',
  templateUrl: './attendancereport.component.html',
  styleUrls: ['./attendancereport.component.css']
})
export class AttendancereportComponent {
  attendanceList: any[] = [];
  areas: any[] = [];
  user: any;
  area: any = null;
  attSearchquery: any = null;
  totalRecords: any;
  pageNo: any = 1;
  pageSize: any = 10;
  totalPages: any;;

  calendar = inject(NgbCalendar);
  formatter = inject(NgbDateParserFormatter);

  hoveredDate: NgbDate | null = null;
  fromDate: NgbDate | null = this.calendar.getToday();
  toDate: NgbDate | null = this.calendar.getNext(this.calendar.getToday(), 'd', 10);

  constructor(private areaService: AreaService, private userService: UserService, private attendanceService: AttendanceService) {
    this.userService.user$.subscribe((user) => {
      this.user = user.user; // Update user info dynamically
    });
  }



  ngOnInit(): void {

    this.loadAreas(this.user.clientId);
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

  // Triggered when the Gateways types in the search field
  // Triggered when the Gateways types in the search field
  onKeySearch() {
    const fromDate = this.convertToDate(this.fromDate);
    const toDate = this.convertToDate(this.toDate);
    let Obj = {
      "fromDate": fromDate,//fromDate?.toLocaleDateString(),
      "toDate": toDate,//toDate?.toLocaleDateString(),
      "clientId": this.user.clientId,
      "query": this.attSearchquery,
      "areaId": this.area,
      "pageSize": this.pageSize,
      "pageNo": 1
    }
    this.pageNo = 1;
    this.loadAttendance(Obj);
  }

  ViewDataForEdit(student: any) {

  }

  // This function is called when the switch is toggled
  onStatusChange(event: any, student: any) {

  }

  onSelectionChange(event: Event): void {

    const target = event.target as HTMLSelectElement;
    if (target.value != "null") {
      this.area = target.value;
    }
    else {
      this.area = null;
    }
  }

  onDateSelection(date: NgbDate, datepicker: any) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date && date.after(this.fromDate)) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
    if (this.fromDate != null && this.toDate != null) {
      datepicker.close();
    }
  }

  isHovered(date: NgbDate) {
    return (
      this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate)
    );
  }

  isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return (
      date.equals(this.fromDate) ||
      (this.toDate && date.equals(this.toDate)) ||
      this.isInside(date) ||
      this.isHovered(date)
    );
  }

  validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
    const parsed = this.formatter.parse(input);
    return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
  }

  searchAttendance() {

    const fromDate = this.convertToDate(this.fromDate);
    const toDate = this.convertToDate(this.toDate);
    let Obj = {
      "fromDate": fromDate,//fromDate?.toLocaleDateString(),
      "toDate": toDate,//toDate?.toLocaleDateString(),
      "clientId": this.user.clientId,
      "areaId": this.area,
      "query": null,
      "pageSize": this.pageSize,
      "pageNo": 1
    }
    this.pageNo = 1;
    this.loadAttendance(Obj);
  }

  // Load all areas
  loadAttendance(payload: any): void {
    //this.totalPages=0;
    this.attendanceService.getAttendanceReport(payload).subscribe(
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
    const fromDate = this.convertToDate(this.fromDate);
    const toDate = this.convertToDate(this.toDate);
    let Obj = {
      "fromDate": fromDate,//fromDate?.toLocaleDateString(),
      "toDate": toDate,//toDate?.toLocaleDateString(),
      "clientId": this.user.clientId,
      "areaId": this.area,
      "query": this.attSearchquery,
      "pageSize": this.pageSize,
      "pageNo": pageNo
    }

    this.loadAttendance(Obj);
  }


  convertToDate(ngbDate: NgbDateStruct | null): String | null {
    if (!ngbDate) {
      console.warn('NgbDateStruct is null or undefined');
      return null;
    }
    return format(new Date(ngbDate.year, ngbDate.month - 1, ngbDate.day), 'yyyy-MM-dd'); // Month is 0-based
  }

  exportToPDF() {
    const doc = new jsPDF();    
    const fromDate = this.convertToDate(this.fromDate);
    const toDate = this.convertToDate(this.toDate);

    let payload = {
      "fromDate": fromDate,//fromDate?.toLocaleDateString(),
      "toDate": toDate,//toDate?.toLocaleDateString(),
      "clientId": this.user.clientId,
      "areaId": this.area,
      "query": this.attSearchquery,
      "pageSize": this.totalPages,
      "pageNo": 1
    }
    this.attendanceService.getAttendanceReport(payload).subscribe(
      (data) => {
        this.attendanceList = data.data;
        let exportData = this.attendanceList.map((item, index) => {return [index+1,item.studentRegistrationNo,item.deviceId,item.attendanceStatus,item.areaName , item.isAuthorized,format(item.lastDetectionTime, 'dd/MM/yyyy, hh:mm:ss a')]})
        // Add text or content to the PDF
       
        // Add table data to PDF
        autoTable(doc, {
          head: [['#', 'Student ID', 'Device ID','Attendance Status', 'Detected Area', 'Detected Area Type', 'Detection Time']],  // Column headers
          body: exportData,  // Table data
        });
        // Save the PDF
        doc.save('exported-file.pdf');

      },
      (error) => {
        console.error('Error fetching attendance list:', error);
      }
    );

  }

  exportToExcel() {

    const fromDate = this.convertToDate(this.fromDate);
    const toDate = this.convertToDate(this.toDate);
    let payload = {
      "fromDate": fromDate,//fromDate?.toLocaleDateString(),
      "toDate": toDate,//toDate?.toLocaleDateString(),
      "clientId": this.user.clientId,
      "areaId": this.area,
      "query": this.attSearchquery,
      "pageSize": this.totalPages,
      "pageNo": 1
    }

    let exportData = this.attendanceList.map((item, index) => {return {"#":index+1,"studentRegistrationNo":item.studentRegistrationNo,"deviceId":item.deviceId,"attendanceStatus":item.attendanceStatus,"areaName":item.areaName ,isAuthorized: item.isAuthorized,lastDetectionTime:format(item.lastDetectionTime, 'dd/MM/yyyy, hh:mm:ss a')}})
    this.attendanceService.getAttendanceReport(payload).subscribe(
      (data) => {
        this.attendanceList = data.data;
        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

        // Save the Excel file
        XLSX.writeFile(wb, 'exported-file.xlsx');
      },
      (error) => {
        console.error('Error fetching attendance list:', error);
      }
    );

  }
}
