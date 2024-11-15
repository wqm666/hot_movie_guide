import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://127.0.0.1:5000/auth';

  constructor(private http: HttpClient) {}

  register(user: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/register`, user);
  }

  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/login`, credentials, { withCredentials: true });
  }

  getUserInfo(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/user`, { withCredentials: true });
  }

  updateUserInfo(user: any): Observable<any> {
    const headers = new HttpHeaders().set('x-access-token', this.getToken());
    return this.http.put<any>(`${this.baseUrl}/update`, user, { headers, withCredentials: true });
  }

  logout(): Observable<any> {
    const headers = new HttpHeaders().set('x-access-token', this.getToken());
    return this.http.post<any>(`${this.baseUrl}/logout`, {}, { headers, withCredentials: true });
  }

  deleteUser(): Observable<any> {
    const headers = new HttpHeaders().set('x-access-token', this.getToken());
    return this.http.delete<any>(`${this.baseUrl}/delete_user`, { headers, withCredentials: true });
  }

  isLoggedIn(): boolean {
    return !!sessionStorage.getItem('token');
  }

  private getToken(): string {
    return sessionStorage.getItem('token') || '';
  }
}
