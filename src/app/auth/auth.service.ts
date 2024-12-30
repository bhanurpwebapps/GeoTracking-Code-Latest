import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { UserService } from '../shared/services/user.service';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl + '/auth'; // Assuming your API has an 'auth' endpoint

  constructor(private http: HttpClient,private router:Router,private userService:UserService) {}

  // Login function
  login(username: string, password: string): Observable<any> {
    const body = { username, password };
    return this.http
      .post<any>(`${this.apiUrl}/login`, body)
      .pipe(catchError(this.handleError));
  }


  // Login function
  changePassword(body:any): Observable<any> {
    return this.http
      .post<any>(`${this.apiUrl}/change-password`, body)
      .pipe(catchError(this.handleError));
  }

  // Store JWT token in local storage
  setToken(token: string): void {
    localStorage.setItem('authToken', token);
  }

  // Get stored token
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  // Logout by clearing the token
  logout(): void {
    localStorage.removeItem('authToken');
    this.userService.clearUser();
    this.router.navigate(['/login']);
  }

  // Error handling function
  private handleError(error: any) {
    console.error('An error occurred', error);
    return throwError(() => new Error(error));
  }
}
