import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private baseUrl = 'http://127.0.0.1:5000/favorites';

  constructor(private http: HttpClient) {}

  addFavorite(movieId: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.getToken()}`);
    return this.http.post<any>(`${this.baseUrl}`, { movieId }, { headers });
  }

  getUserFavorites(): Observable<any[]> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.getToken()}`);
    return this.http.get<any[]>(`${this.baseUrl}/user`, { headers });
  }

  deleteFavorite(favoriteId: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.getToken()}`);
    return this.http.delete<any>(`${this.baseUrl}/${favoriteId}`, { headers });
  }

  private getToken(): string {
    return localStorage.getItem('token') || '';
  }
}
