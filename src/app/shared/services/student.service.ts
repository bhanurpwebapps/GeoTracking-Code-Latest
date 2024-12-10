import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private baseUrl = environment.apiUrl; // Adjust the base URL as needed
  constructor(private http: HttpClient) { }
  
  // Example: Create a client
  createStudent(areaData: any): Observable<any> {
    const url = `${this.baseUrl}/students/create`;
    return this.http.post(url, areaData);
  }

  // Example: Get all clients
  getStudents(clientId:any,areaId:any): Observable<any> {
    if(areaId)
    {
      const url = `${this.baseUrl}/students?clientId=${clientId}&areaId=${areaId}`;
      return this.http.get(url);
    }
    else
    {
      const url = `${this.baseUrl}/students?clientId=${clientId}`;
      return this.http.get(url);
    }
    
  }

  StudentStatusChange(studentData:any): Observable<any> {
    const url = `${this.baseUrl}/students/update-status`;
    return this.http.post(url, studentData);
  }

  // Method to search clients by partial name or email
  searchStudent(query: string,clientId:string,areaId:string): Observable<any> {
    //return this.http.get(`${this.baseUrl}/students/search?query=${query}&clientId=${clientId}&areaId=${areaId}`);
    if(areaId)
      {
        const url = `${this.baseUrl}/students/search?query=${query}&clientId=${clientId}&areaId=${areaId}`;
        return this.http.get(url);
      }
      else
      {
        const url = `${this.baseUrl}/students/search?query=${query}&clientId=${clientId}`;
        return this.http.get(url);
      }
  }
}
