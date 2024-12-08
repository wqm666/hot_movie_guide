import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * Service to manage user authentication.
 * Provides methods to handle user registration, login, logout,
 * and user information retrieval and update.
 * This service interacts with the authentication backend to manage 
 * users' sessions, registration, login credentials, and other user-related data.
 * @since v1.0.0
 * @author Zirun Wang
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  /**
   * Base URL for the authentication endpoint.
   * This URL is used as the base for all authentication-related API requests.
   * @private
   * @type {string}
   */
  private baseUrl = 'http://127.0.0.1:5000/auth';

  /**
   * @constructor
   * @param { HttpClient } http - The HTTP client service used for making HTTP requests to the backend.
   * This is injected to facilitate communication with the backend server for authentication actions.
   */
  constructor(private http: HttpClient) {}

  /**
   * Registers a new user.
   * This method sends a POST request to the backend with the user data to create a new user account.
   * @since v1.0.0
   * @param { any } user - The user data to register, typically including fields like username, password, etc.
   * @returns { Observable<any> } - An observable that emits the response from the server after registration.
   */
  register(user: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/register`, user);
  }

  /**
   * Logs in a user.
   * This method sends the user's login credentials (username/password) to the backend to authenticate the user.
   * A session is created on the backend if the credentials are valid, and the user's information is stored.
   * @since v1.0.0
   * @param { any } credentials - The user's login credentials, typically containing a username and password.
   * @returns { Observable<any> } - An observable that emits the authentication response, typically including a token.
   */
  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/login`, credentials, { withCredentials: true });
  }

  /**
   * Retrieves the logged-in user's information.
   * This method sends a GET request to fetch the details of the logged-in user.
   * @since v1.0.0
   * @returns { Observable<any> } - An observable that emits the user's information, such as profile data.
   */
  getUserInfo(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/user`, { withCredentials: true });
  }

  /**
   * Updates the logged-in user's information.
   * This method sends the updated user data to the backend to update the user's profile.
   * It includes the current authentication token in the request header.
   * @since v1.0.0
   * @param { any } user - The updated user data to modify, such as changes to the username or other profile fields.
   * @returns { Observable<any> } - An observable that emits the server's response after the update.
   */
  updateUserInfo(user: any): Observable<any> {
    const headers = new HttpHeaders().set('x-access-token', this.getToken());
    return this.http.put<any>(`${this.baseUrl}/update`, user, { headers, withCredentials: true });
  }

  /**
   * Logs out the current user.
   * This method sends a POST request to the backend to log out the user and invalidate their session.
   * @since v1.0.0
   * @returns { Observable<any> } - An observable that emits the response from the server after logging out.
   */
  logout(): Observable<any> {
    const headers = new HttpHeaders().set('x-access-token', this.getToken());
    return this.http.post<any>(`${this.baseUrl}/logout`, {}, { headers, withCredentials: true });
  }

  /**
   * Deletes the current logged-in user's account.
   * This method sends a DELETE request to the backend to remove the user account from the system.
   * @since v1.0.0
   * @returns { Observable<any> } - An observable that emits the server's response after deleting the user.
   */
  deleteUser(): Observable<any> {
    const headers = new HttpHeaders().set('x-access-token', this.getToken());
    return this.http.delete<any>(`${this.baseUrl}/delete_user`, { headers, withCredentials: true });
  }

  /**
   * Checks if the user is currently logged in.
   * This method checks if a valid session exists by verifying if a token is stored in session storage.
   * @since v1.0.0
   * @returns { boolean } - True if the user is logged in (i.e., a valid token exists in session storage), false otherwise.
   */
  isLoggedIn(): boolean {
    return !!sessionStorage.getItem('token');
  }

  /**
   * Retrieves the authentication token from session storage.
   * This method fetches the token used for user authentication from session storage.
   * @private
   * @since v1.0.0
   * @returns { string } - The authentication token stored in session storage or an empty string if not found.
   */
  private getToken(): string {
    return sessionStorage.getItem('token') || '';
  }
}