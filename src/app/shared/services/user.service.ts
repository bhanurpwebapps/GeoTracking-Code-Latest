import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userSubject = new BehaviorSubject<any>(null); // Store user information
  user$ = this.userSubject.asObservable();             // Observable to listen for user updates
  private baseUrl = environment.apiUrl; // Adjust the base URL as needed
  constructor(private http: HttpClient) {}

  setUser(user: any): void {
    debugger;
    this.userSubject.next(user); // Update user info
    localStorage.setItem('user', JSON.stringify(user)); // Persist in localStorage
  }

  getUser(): any {
    const user = this.userSubject.getValue();
    if (!user) {
      const storedUser = localStorage.getItem('user'); // Fetch from localStorage if not already loaded
      if (storedUser) {
        this.userSubject.next(JSON.parse(storedUser));
        return JSON.parse(storedUser);
      }
    }
    return user;
  }

  clearUser(): void {
    this.userSubject.next(null);      // Clear user info
    localStorage.removeItem('user'); // Remove from localStorage
  }
  // Example: Create a client
  createUser(clientData: any): Observable<any> {
    const url = `${this.baseUrl}/user/create`;
    return this.http.post(url, clientData);
  }
  // Example: Get all clients
  getUsers(clientId:any): Observable<any> {
    const url = `${this.baseUrl}/user?clientId=${clientId}`;
    return this.http.get(url);
  }

  userStatusChange(clientData:any): Observable<any> {
    const url = `${this.baseUrl}/user/update-status`;
    return this.http.post(url, clientData);
  }

  // Method to search clients by partial name or email
  searchUsers(query: string,clientId:string): Observable<any> {
    return this.http.get(`${this.baseUrl}/user/search?query=${query}&clientId=${clientId}`);
  }
}
