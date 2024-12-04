import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * Service to manage admin-related operations.
 * Provides methods to manage users and movies within the admin scope.
 * @since v1.0.0
 * @autor Zirun Wang
 */
@Injectable({
  providedIn: 'root'
})
export class AdminService {
  /**
   * Base URL for the admin endpoint.
   * @private
   */
  private baseUrl = 'http://127.0.0.1:5000/admin';

  /**
   * @constructor
   * @param { HttpClient } http - The HTTP client service used for making HTTP requests.
   */
  constructor(private http: HttpClient) {}

  /**
   * Retrieves all users.
   * @returns { Observable<any[]> } - An observable that emits the list of all users.
   * @since v1.0.0
   */
  getAllUsers(): Observable<any[]> {
    const headers = new HttpHeaders().set('x-access-token', this.getToken());
    return this.http.get<any[]>(`${this.baseUrl}/all_users`, { headers, withCredentials: true });
  }

  /**
   * Retrieves all admin users.
   * @returns { Observable<any[]> } - An observable that emits the list of all admin users.
   * @since v1.0.0
   */
  getAdminUsers(): Observable<any[]> {
    const headers = new HttpHeaders().set('x-access-token', this.getToken());
    return this.http.get<any[]>(`${this.baseUrl}/admin_users`, { headers, withCredentials: true });
  }

  /**
   * Toggles the admin status of a user.
   * @param { string } user_id - The ID of the user whose admin status is to be toggled.
   * @returns { Observable<any> } - An observable that emits the response from the server.
   * @since v1.0.0
   */
  toggleAdmin(user_id: string): Observable<any> {
    const headers = new HttpHeaders().set('x-access-token', this.getToken());
    return this.http.post<any>(`${this.baseUrl}/toggle_admin`, { user_id }, { headers, withCredentials: true });
  }

  /**
   * Adds a new movie.
   * @param { any } movie - The movie data to add.
   * @returns { Observable<any> } - An observable that emits the response from the server.
   * @since v1.0.0
   */
  addMovie(movie: any): Observable<any> {
    const headers = new HttpHeaders().set('x-access-token', this.getToken());
    return this.http.post<any>('http://127.0.0.1:5000/movies/', movie, { headers, withCredentials: true });
  }

  /**
   * Updates an existing movie.
   * @param { string } movie_id - The ID of the movie to update.
   * @param { any } movie - The updated movie data.
   * @returns { Observable<any> } - An observable that emits the response from the server.
   * @since v1.0.0
   */
  updateMovie(movie_id: string, movie: any): Observable<any> {
    const headers = new HttpHeaders().set('x-access-token', this.getToken());
    return this.http.put<any>(`http://127.0.0.1:5000/movies/${movie_id}`, movie, { headers, withCredentials: true });
  }

  /**
   * Deletes a movie.
   * @param { string } movie_id - The ID of the movie to delete.
   * @returns { Observable<any> } - An observable that emits the response from the server.
   * @since v1.0.0
   */
  deleteMovie(movie_id: string): Observable<any> {
    const headers = new HttpHeaders().set('x-access-token', this.getToken());
    return this.http.delete<any>(`http://127.0.0.1:5000/movies/${movie_id}`, { headers, withCredentials: true });
  }

  /**
   * Retrieves the authentication token from session storage.
   * @private
   * @returns { string } - The authentication token.
   */
  private getToken(): string {
    return sessionStorage.getItem('token') || '';
  }
}