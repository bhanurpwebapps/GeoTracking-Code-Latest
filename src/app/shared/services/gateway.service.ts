import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GatewayService {
  private baseUrl = environment.apiUrl; // Adjust the base URL as needed
  constructor(private http: HttpClient) { }

  // Example: Create a client
  createGateway(gatewayData: any): Observable<any> {
    const url = `${this.baseUrl}/gateways/create`;
    return this.http.post(url, gatewayData);
  }

  // Example: Get all clients
  getGateways(clientId:any): Observable<any> {
    const url = `${this.baseUrl}/gateways?clientId=${clientId}`;
    return this.http.get(url);
  }

  // Example: Update client
  updateGateway(clientId: string, gatewayData: any): Observable<any> {
    const url = `${this.baseUrl}/gateways/${clientId}`;
    return this.http.put(url, gatewayData);
  }


  GatewayStatusChange(gatewayData:any): Observable<any> {
    const url = `${this.baseUrl}/gateways/update-status`;
    return this.http.post(url, gatewayData);
  }

  // Method to search clients by partial name or email
  searchGateways(query: string,clientId:string): Observable<any> {
    return this.http.get(`${this.baseUrl}/gateways/search?query=${query}&clientId=${clientId}`);
  }
}
