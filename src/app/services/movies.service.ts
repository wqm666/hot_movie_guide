import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * Service to manage movies.
 * Provides methods to retrieve, filter, sort, and aggregate movie data.
 * @since v1.0.0
 * @autor Zirun Wang
 */
@Injectable({
  providedIn: 'root'
})
export class MoviesService {
  /**
   * Base URL for the movies endpoint.
   * @private
   */
  private baseUrl = 'http://127.0.0.1:5000/movies';

  /**
   * @constructor
   * @param { HttpClient } http - The HTTP client service used for making HTTP requests.
   */
  constructor(private http: HttpClient) {}

  /**
   * Retrieves all movies.
   * @returns { Observable<any[]> } - An observable that emits the list of all movies.
   * @since v1.0.0
   */
  getAllMovies(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/`, { withCredentials: true });
  }

  /**
   * Retrieves a movie by its ID.
   * @param { string } movie_id - The ID of the movie to be retrieved.
   * @returns { Observable<any> } - An observable that emits the movie data.
   * @since v1.0.0
   */
  getMovieById(movie_id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${movie_id}`, { withCredentials: true });
  }

  /**
   * Retrieves the details of a specific movie.
   * @param { string } movie_id - The ID of the movie.
   * @param { string } detailId - The ID of the detail to be retrieved.
   * @returns { Observable<any> } - An observable that emits the movie detail data.
   * @since v1.0.0
   */
  getMovieDetails(movie_id: string, detailId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/details/${movie_id}/${detailId}`, { withCredentials: true });
  }

  /**
   * Filters movies based on provided criteria.
   * @param { any } criteria - The criteria to filter movies.
   * @returns { Observable<any[]> } - An observable that emits the filtered list of movies.
   * @since v1.0.0
   */
  filterMovies(criteria: any): Observable<any[]> {
    return this.http.post<any[]>(`${this.baseUrl}/filter`, criteria, { withCredentials: true });
  }

  /**
   * Sorts movies based on provided criteria.
   * @param { any } criteria - The criteria to sort movies.
   * @returns { Observable<any[]> } - An observable that emits the sorted list of movies.
   * @since v1.0.0
   */
  sortMovies(criteria: any): Observable<any[]> {
    return this.http.post<any[]>(`${this.baseUrl}/sort`, criteria, { withCredentials: true });
  }

  /**
   * Aggregates movie data based on provided criteria.
   * @param { any } criteria - The criteria to aggregate movie data.
   * @returns { Observable<any[]> } - An observable that emits the aggregated movie data.
   * @since v1.0.0
   */
  aggregateMovies(criteria: any): Observable<any[]> {
    return this.http.post<any[]>(`${this.baseUrl}/aggregate`, criteria, { withCredentials: true });
  }

  /**
   * Summarizes movie data.
   * @returns { Observable<any[]> } - An observable that emits the summary of movie data.
   * @since v1.0.0
   */
  summarizeMovies(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/summarize`, { withCredentials: true });
  }
}