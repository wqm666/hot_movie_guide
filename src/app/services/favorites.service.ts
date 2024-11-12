import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private baseUrl = 'http://127.0.0.1:5000/favorites';

  constructor(private http: HttpClient) {}

  addFavorite(movie_id: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/`, { movie_id }, { withCredentials: true });
  }

  getUserFavorites(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/user`, { withCredentials: true });
  }

  deleteFavorite(favorite_id: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${favorite_id}`, { withCredentials: true });
  }
}
