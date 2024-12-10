import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private baseUrl = environment.apiUrl; // Adjust the base URL as needed
  constructor(private http: HttpClient) {
    
   }
   // Example: Create a client
  DataSummaryCount(clientId:string): Observable<any> {
    //const url = `${this.baseUrl}/dashboard/dashboarddata`;
    //return this.http.post(url, clientData);
    if(clientId)
      {
        const url = `${this.baseUrl}/dashboard/dashboarddata?clientId=${clientId}`;
        return this.http.get(url);
      }
      else
      {
        const url = `${this.baseUrl}/dashboard/dashboarddata`;
        return this.http.get(url);
      }
  }
}
