import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private baseUrl = environment.apiUrl; // Adjust the base URL as needed
  constructor(private http: HttpClient) {
    
   }
   // Example: Create a client
  createClient(clientData: any): Observable<any> {
    const url = `${this.baseUrl}/client/create`;
    return this.http.post(url, clientData);
  }

  // Example: Get all clients
  getClients(): Observable<any> {
    const url = `${this.baseUrl}/client`;
    return this.http.get(url);
  }

  // Example: Update client
  updateClient(clientId: string, clientData: any): Observable<any> {
    const url = `${this.baseUrl}/client/${clientId}`;
    return this.http.put(url, clientData);
  }

  // Example: Delete client
  deleteClient(clientId: string): Observable<any> {
    const url = `${this.baseUrl}/client/${clientId}`;
    return this.http.delete(url);
  }

  clientStatusChange(clientData:any): Observable<any> {
    const url = `${this.baseUrl}/client/update-status`;
    return this.http.post(url, clientData);
  }

  // Method to search clients by partial name or email
  searchClients(query: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/client/search?query=${query}`);
  }
}
