import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * Service to manage movies.
 * Provides methods to retrieve, filter, sort, and aggregate movie data.
 * This service interacts with a backend to fetch, manipulate, and summarize movie data.
 * @since v1.0.0
 * @author Zirun Wang
 */
@Injectable({
  providedIn: 'root'
})
export class MoviesService {
  /**
   * Base URL for the movies endpoint.
   * @private
   * @type {string}
   */
  private baseUrl = 'http://127.0.0.1:5000/movies';

  /**
   * @constructor
   * @param { HttpClient } http - The HTTP client service used for making HTTP requests to the backend.
   * The `HttpClient` is injected to perform API calls related to movie data.
   */
  constructor(private http: HttpClient) {}

  /**
   * Retrieves all movies.
   * This method fetches the list of all movies available in the backend system.
   * @since v1.0.0
   * @returns { Observable<any[]> } - An observable that emits the list of all movies.
   */
  getAllMovies(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/`, { withCredentials: true });
  }

  /**
   * Retrieves a movie by its ID.
   * This method fetches the details of a movie by its unique identifier.
   * @since v1.0.0
   * @param { string } movie_id - The ID of the movie to be retrieved.
   * @returns { Observable<any> } - An observable that emits the movie data.
   */
  getMovieById(movie_id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${movie_id}`, { withCredentials: true });
  }

  /**
   * Retrieves the details of a specific movie.
   * This method fetches a specific detail of a movie by its movie ID and detail ID.
   * @since v1.0.0
   * @param { string } movie_id - The ID of the movie.
   * @param { string } detailId - The ID of the detail to be retrieved.
   * @returns { Observable<any> } - An observable that emits the movie detail data.
   */
  getMovieDetails(movie_id: string, detailId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/details/${movie_id}/${detailId}`, { withCredentials: true });
  }

  /**
   * Filters movies based on provided criteria.
   * This method sends a POST request to filter movies based on the provided criteria, 
   * such as genre, release date, rating, etc.
   * @since v1.0.0
   * @param { any } criteria - The criteria to filter movies. It may include parameters such as genre, release year, etc.
   * @returns { Observable<any[]> } - An observable that emits the filtered list of movies.
   */
  filterMovies(criteria: any): Observable<any[]> {
    return this.http.post<any[]>(`${this.baseUrl}/filter`, criteria, { withCredentials: true });
  }

  /**
   * Sorts movies based on provided criteria.
   * This method sorts the movies list based on parameters like title, rating, release year, etc.
   * @since v1.0.0
   * @param { any } criteria - The criteria to sort movies. It may include properties like "rating" or "release year".
   * @returns { Observable<any[]> } - An observable that emits the sorted list of movies.
   */
  sortMovies(criteria: any): Observable<any[]> {
    return this.http.post<any[]>(`${this.baseUrl}/sort`, criteria, { withCredentials: true });
  }

  /**
   * Aggregates movie data based on provided criteria.
   * This method performs aggregation on movie data, such as calculating average ratings, 
   * grouping movies by genre, etc.
   * @since v1.0.0
   * @param { any } criteria - The criteria to aggregate movie data. It could include operations like "average rating" or "count per genre".
   * @returns { Observable<any[]> } - An observable that emits the aggregated movie data.
   */
  aggregateMovies(criteria: any): Observable<any[]> {
    return this.http.post<any[]>(`${this.baseUrl}/aggregate`, criteria, { withCredentials: true });
  }

  /**
   * Summarizes movie data.
   * This method provides a summary of the entire movie database, including total movie count, 
   * average ratings, etc.
   * @since v1.0.0
   * @returns { Observable<any[]> } - An observable that emits the summary of movie data.
   */
  summarizeMovies(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/summarize`, { withCredentials: true });
  }
}