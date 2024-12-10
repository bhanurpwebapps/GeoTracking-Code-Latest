import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SchoolService {
  private baseUrl = environment.apiUrl; // Adjust the base URL as needed

  constructor(private http: HttpClient) {}

  // Fetch school configuration by client ID
  getSchoolConfig(clientId: string): Observable<any> {
    const url = `${this.baseUrl}/schools`;
    return this.http.get(`${url}/${clientId}`);
  }

  // Upsert school configuration
  upsertSchoolConfig(config: any): Observable<any> {
    const url = `${this.baseUrl}/schools`;
    return this.http.post(`${url}/upsertSchoolConfiguration`, config);
  }

  //Delete school configuration
  deleteSchoolConfig(clientId: string): Observable<any> {
    const url = `${this.baseUrl}/schools`;
    return this.http.delete(`${url}/${clientId}`);
  }
}
