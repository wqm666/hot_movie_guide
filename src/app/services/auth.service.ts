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
    return this.http.post<any>(`${this.baseUrl}/login`, credentials);
  }

  getUserInfo(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/user`);
  }

  updateUserInfo(user: any): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.getToken()}`);
    return this.http.put<any>(`${this.baseUrl}/update`, user, { headers });
  }

  logout(): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.getToken()}`);
    return this.http.post<any>(`${this.baseUrl}/logout`, {}, { headers });
  }

  deleteUser(): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.getToken()}`);
    return this.http.delete<any>(`${this.baseUrl}/delete_user`, { headers });
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  private getToken(): string {
    return localStorage.getItem('token') || '';
  }
}
