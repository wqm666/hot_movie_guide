import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private baseUrl = 'http://127.0.0.1:5000/admin';

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<any[]> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.getToken()}`);
    return this.http.get<any[]>(`${this.baseUrl}/all_users`, { headers, withCredentials: true });
  }

  getAdminUsers(): Observable<any[]> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.getToken()}`);
    return this.http.get<any[]>(`${this.baseUrl}/admin_users`, { headers, withCredentials: true });
  }

  toggleAdmin(userId: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.getToken()}`);
    return this.http.post<any>(`${this.baseUrl}/toggle_admin`, { userId }, { headers, withCredentials: true });
  }

  addMovie(movie: any): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.getToken()}`);
    return this.http.post<any>('http://127.0.0.1:5000/movies', movie, { headers, withCredentials: true });
  }

  updateMovie(movieId: string, movie: any): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.getToken()}`);
    return this.http.put<any>(`http://127.0.0.1:5000/movies/update/${movieId}`, movie, { headers, withCredentials: true });
  }

  deleteMovie(movieId: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.getToken()}`);
    return this.http.delete<any>(`http://127.0.0.1:5000/movies/delete/${movieId}`, { headers, withCredentials: true });
  }

  private getToken(): string {
    return sessionStorage.getItem('token') || '';
  }
}
