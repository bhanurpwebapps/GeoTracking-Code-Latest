import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {

  private baseUrl = environment.apiUrl; // Adjust the base URL as needed
  constructor(private http: HttpClient) { }

  // Get enum values (if exposed by API)
  getTodaysAttendance(clientId: string, areaId: string, deviceId: string, studentId: string): Observable<any> {

    const url = `${this.baseUrl}/Attendance/today?clientId=${clientId}&query=${areaId}&deviceId=${deviceId}&studentId=${studentId}`;
    return this.http.get(url);
  }

  // Get enum values (if exposed by API)
  todaystudenttrack(payload:any): Observable<any> {
    
    const url = `${this.baseUrl}/Attendance/todaystudenttrack`;
    return this.http.post(url, payload);
  }

  // Get enum values (if exposed by API)
  getAttendanceReport(payload: any): Observable<any> {

    const url = `${this.baseUrl}/Attendance/attendance`;
    return this.http.post(url, payload);
  }
}
