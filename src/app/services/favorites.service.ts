import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * Service to manage user's favorite movies.
 * This service handles the operations of adding, fetching, and deleting favorite movies.
 * It interacts with the backend API to store and retrieve the user's favorite movie list.
 * @since v1.0.0
 * @author Zirun Wang
 */
@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  /**
   * Base URL for the favorites endpoint.
   * This is the root URL used to interact with the backend for the user's favorite movies.
   * @private
   */
  private baseUrl = 'http://127.0.0.1:5000/favorites';

  /**
   * @constructor
   * @param { HttpClient } http - The HTTP client service used for making HTTP requests to the backend.
   * This is used to perform actions like adding, fetching, and deleting favorite movies.
   */
  constructor(private http: HttpClient) {}

  /**
   * Adds a movie to the user's favorites.
   * Sends an HTTP POST request to add a movie by its ID to the list of favorites for the user.
   * @param { string } movie_id - The ID of the movie to be added to the user's favorites.
   * @returns { Observable<any> } - An observable that emits the server's response, typically success or failure message.
   * @since v1.0.0
   * @todo Add error handling for HTTP request
   */
  addFavorite(movie_id: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/`, { movie_id }, { withCredentials: true });
  }

  /**
   * Gets the user's favorite movies.
   * Sends an HTTP GET request to fetch the list of movies that the user has marked as favorites.
   * @returns { Observable<any[]> } - An observable that emits an array of the user's favorite movies.
   * Each movie object in the array contains details such as movie ID, title, etc.
   * @since v1.0.0
   * @todo Optimize caching for user favorites
   */
  getUserFavorites(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/user`, { withCredentials: true });
  }

  /**
   * Deletes a movie from the user's favorites.
   * Sends an HTTP DELETE request to remove a movie from the user's favorite list.
   * @param { string } favorite_id - The ID of the favorite entry to be deleted.
   * @returns { Observable<any> } - An observable that emits the server's response, typically a success message or error.
   * @since v1.0.0
   */
  deleteFavorite(favorite_id: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${favorite_id}`, { withCredentials: true });
  }
}