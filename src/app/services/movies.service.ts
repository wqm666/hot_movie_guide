import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MoviesService {
  private baseUrl = 'http://127.0.0.1:5000/movies';

  constructor(private http: HttpClient) {}

  getAllMovies(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}`, { withCredentials: true });
  }

  getMovieById(movieId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${movieId}`, { withCredentials: true });
  }

  getMovieDetails(movieId: string, detailId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/details/${movieId}/${detailId}`, { withCredentials: true });
  }

  filterMovies(criteria: any): Observable<any[]> {
    return this.http.post<any[]>(`${this.baseUrl}/filter`, criteria, { withCredentials: true });
  }

  sortMovies(criteria: any): Observable<any[]> {
    return this.http.post<any[]>(`${this.baseUrl}/sort`, criteria, { withCredentials: true });
  }

  aggregateMovies(criteria: any): Observable<any[]> {
    return this.http.post<any[]>(`${this.baseUrl}/aggregate`, criteria, { withCredentials: true });
  }

  summarizeMovies(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/summarize`, { withCredentials: true });
  }

  private getToken(): string {
    return sessionStorage.getItem('token') || '';
  }
}
