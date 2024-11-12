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
    return this.http.get<any[]>(`${this.baseUrl}/`, { withCredentials: true });
  }

  getMovieById(movie_id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${movie_id}`, { withCredentials: true });
  }

  getMovieDetails(movie_id: string, detailId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/details/${movie_id}/${detailId}`, { withCredentials: true });
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
}
