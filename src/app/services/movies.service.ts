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
    return this.http.get<any[]>(`${this.baseUrl}`);
  }

  getMovieById(movieId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${movieId}`);
  }

  getMovieDetails(movieId: string, detailId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/details/${movieId}/${detailId}`);
  }

  filterMovies(criteria: any): Observable<any[]> {
    return this.http.post<any[]>(`${this.baseUrl}/filter`, criteria);
  }

  sortMovies(criteria: any): Observable<any[]> {
    return this.http.post<any[]>(`${this.baseUrl}/sort`, criteria);
  }

  aggregateMovies(criteria: any): Observable<any[]> {
    return this.http.post<any[]>(`${this.baseUrl}/aggregate`, criteria);
  }

  summarizeMovies(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/summarize`);
  }

  addMovie(movie: any): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.getToken()}`);
    return this.http.post<any>(`${this.baseUrl}`, movie, { headers });
  }

  updateMovie(movieId: string, movie: any): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.getToken()}`);
    return this.http.put<any>(`${this.baseUrl}/update/${movieId}`, movie, { headers });
  }

  deleteMovie(movieId: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.getToken()}`);
    return this.http.delete<any>(`${this.baseUrl}/delete/${movieId}`, { headers });
  }

  private getToken(): string {
    return sessionStorage.getItem('token') || '';
  }
}
