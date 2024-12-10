import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AreaService {
  private baseUrl = environment.apiUrl; // Adjust the base URL as needed
  constructor(private http: HttpClient) { }

  // Get enum values (if exposed by API)
  getAreaEnums(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/areas/getAreaTypes`);
  }

  // Example: Create a client
  createArea(areaData: any): Observable<any> {
    const url = `${this.baseUrl}/areas/create`;
    return this.http.post(url, areaData);
  }

  // Example: Get all clients
  getAreas(clientId:any): Observable<any> {
    const url = `${this.baseUrl}/areas?clientId=${clientId}`;
    return this.http.get(url);
  }

  // Example: Update client
  updateArea(clientId: string, areaData: any): Observable<any> {
    const url = `${this.baseUrl}/areas/${clientId}`;
    return this.http.put(url, areaData);
  }


  AreaStatusChange(areaData:any): Observable<any> {
    const url = `${this.baseUrl}/areas/update-status`;
    return this.http.post(url, areaData);
  }

  // Method to search clients by partial name or email
  searchAreas(query: string,clientId:string): Observable<any> {
    return this.http.get(`${this.baseUrl}/areas/search?query=${query}&clientId=${clientId}`);
  }
}
