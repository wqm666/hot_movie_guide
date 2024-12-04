import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * Service to manage user authentication.
 * Provides methods to handle user registration, login, logout,
 * and user information retrieval and update.
 * @since v1.0.0
 * @autor Zirun Wang
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  /**
   * Base URL for the authentication endpoint.
   * @private
   */
  private baseUrl = 'http://127.0.0.1:5000/auth';

  /**
   * @constructor
   * @param { HttpClient } http - The HTTP client service used for making HTTP requests.
   */
  constructor(private http: HttpClient) {}

  /**
   * Registers a new user.
   * @param { any } user - The user data to register.
   * @returns { Observable<any> } - An observable that emits the response from the server.
   * @since v1.0.0
   */
  register(user: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/register`, user);
  }

  /**
   * Logs in a user.
   * @param { any } credentials - The user's login credentials.
   * @returns { Observable<any> } - An observable that emits the response from the server.
   * @since v1.0.0
   */
  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/login`, credentials, { withCredentials: true });
  }

  /**
   * Retrieves the logged-in user's information.
   * @returns { Observable<any> } - An observable that emits the user's information.
   * @since v1.0.0
   */
  getUserInfo(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/user`, { withCredentials: true });
  }

  /**
   * Updates the logged-in user's information.
   * @param { any } user - The updated user data.
   * @returns { Observable<any> } - An observable that emits the response from the server.
   * @since v1.0.0
   */
  updateUserInfo(user: any): Observable<any> {
    const headers = new HttpHeaders().set('x-access-token', this.getToken());
    return this.http.put<any>(`${this.baseUrl}/update`, user, { headers, withCredentials: true });
  }

  /**
   * Logs out the current user.
   * @returns { Observable<any> } - An observable that emits the response from the server.
   * @since v1.0.0
   */
  logout(): Observable<any> {
    const headers = new HttpHeaders().set('x-access-token', this.getToken());
    return this.http.post<any>(`${this.baseUrl}/logout`, {}, { headers, withCredentials: true });
  }

  /**
   * Deletes the current logged-in user's account.
   * @returns { Observable<any> } - An observable that emits the response from the server.
   * @since v1.0.0
   */
  deleteUser(): Observable<any> {
    const headers = new HttpHeaders().set('x-access-token', this.getToken());
    return this.http.delete<any>(`${this.baseUrl}/delete_user`, { headers, withCredentials: true });
  }

  /**
   * Checks if the user is currently logged in.
   * @returns { boolean } - True if the user is logged in, false otherwise.
   * @since v1.0.0
   */
  isLoggedIn(): boolean {
    return !!sessionStorage.getItem('token');
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