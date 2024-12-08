import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * Service to manage admin-related operations.
 * Provides methods to manage users and movies within the admin scope.
 * This service communicates with the backend to allow administrators to manage users' roles,
 * add/update/delete movies, and perform other admin-specific tasks.
 * @since v1.0.0
 * @author Zirun Wang
 */
@Injectable({
  providedIn: 'root'
})
export class AdminService {
  /**
   * Base URL for the admin endpoint.
   * This URL is used as the base for all admin-related API requests.
   * @private
   * @type {string}
   */
  private baseUrl = 'http://127.0.0.1:5000/admin';

  /**
   * @constructor
   * @param { HttpClient } http - The HTTP client service used for making HTTP requests to the backend.
   * This is injected to facilitate communication with the backend server for admin operations.
   */
  constructor(private http: HttpClient) {}

  /**
   * Retrieves all users.
   * This method fetches the list of all users, including their roles and other related information.
   * @since v1.0.0
   * @returns { Observable<any[]> } - An observable that emits the list of all users.
   */
  getAllUsers(): Observable<any[]> {
    const headers = new HttpHeaders().set('x-access-token', this.getToken());
    return this.http.get<any[]>(`${this.baseUrl}/all_users`, { headers, withCredentials: true });
  }

  /**
   * Retrieves all admin users.
   * This method fetches the list of all users who have admin privileges.
   * @since v1.0.0
   * @returns { Observable<any[]> } - An observable that emits the list of all admin users.
   */
  getAdminUsers(): Observable<any[]> {
    const headers = new HttpHeaders().set('x-access-token', this.getToken());
    return this.http.get<any[]>(`${this.baseUrl}/admin_users`, { headers, withCredentials: true });
  }

  /**
   * Toggles the admin status of a user.
   * This method allows changing a user's admin status by toggling it between admin and non-admin.
   * The request includes the user ID to identify which user's admin status needs to be toggled.
   * @since v1.0.0
   * @param { string } user_id - The ID of the user whose admin status is to be toggled.
   * @returns { Observable<any> } - An observable that emits the response from the server.
   */
  toggleAdmin(user_id: string): Observable<any> {
    const headers = new HttpHeaders().set('x-access-token', this.getToken());
    return this.http.post<any>(`${this.baseUrl}/toggle_admin`, { user_id }, { headers, withCredentials: true });
  }

  /**
   * Adds a new movie.
   * This method sends a POST request to the backend to add a new movie to the database.
   * @since v1.0.0
   * @param { any } movie - The movie data to add, including details such as title, genre, etc.
   * @returns { Observable<any> } - An observable that emits the response from the server after adding the movie.
   */
  addMovie(movie: any): Observable<any> {
    const headers = new HttpHeaders().set('x-access-token', this.getToken());
    return this.http.post<any>('http://127.0.0.1:5000/movies/', movie, { headers, withCredentials: true });
  }

  /**
   * Updates an existing movie.
   * This method sends a PUT request to the backend to update the details of an existing movie.
   * @since v1.0.0
   * @param { string } movie_id - The ID of the movie to update.
   * @param { any } movie - The updated movie data, including any modifications to the title, genre, etc.
   * @returns { Observable<any> } - An observable that emits the response from the server after updating the movie.
   */
  updateMovie(movie_id: string, movie: any): Observable<any> {
    const headers = new HttpHeaders().set('x-access-token', this.getToken());
    return this.http.put<any>(`http://127.0.0.1:5000/movies/${movie_id}`, movie, { headers, withCredentials: true });
  }

  /**
   * Deletes a movie.
   * This method sends a DELETE request to the backend to remove a movie from the database using the movie's ID.
   * @since v1.0.0
   * @param { string } movie_id - The ID of the movie to delete.
   * @returns { Observable<any> } - An observable that emits the response from the server after deleting the movie.
   */
  deleteMovie(movie_id: string): Observable<any> {
    const headers = new HttpHeaders().set('x-access-token', this.getToken());
    return this.http.delete<any>(`http://127.0.0.1:5000/movies/${movie_id}`, { headers, withCredentials: true });
  }

  /**
   * Retrieves the authentication token from session storage.
   * This method fetches the token used for admin authentication from session storage.
   * @private
   * @since v1.0.0
   * @returns { string } - The authentication token stored in session storage or an empty string if not found.
   */
  private getToken(): string {
    return sessionStorage.getItem('token') || '';
  }
}