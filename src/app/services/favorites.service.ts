import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * Service to manage user's favorite movies.
 * @since v1.0.0
 * @autor Zirun Wang
 */
@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  /**
   * Base URL for the favorites endpoint.
   * @private
   */
  private baseUrl = 'http://127.0.0.1:5000/favorites';

  /**
   * @constructor
   * @param { HttpClient } http - The HTTP client service used for making HTTP requests.
   */
  constructor(private http: HttpClient) {}

  /**
   * Adds a movie to the user's favorites.
   * @param { string } movie_id - The ID of the movie to be added to the favorites.
   * @returns { Observable<any> } - An observable that emits the response from the server.
   * @since v1.0.0
   * @todo Add error handling for HTTP request
   */
  addFavorite(movie_id: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/`, { movie_id }, { withCredentials: true });
  }

  /**
   * Gets the user's favorite movies.
   * @returns { Observable<any[]> } - An observable that emits the list of the user's favorite movies.
   * @since v1.0.0
   * @todo Optimize caching for user favorites
   */
  getUserFavorites(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/user`, { withCredentials: true });
  }

  /**
   * Deletes a movie from the user's favorites.
   * @param { string } favorite_id - The ID of the favorite to be deleted.
   * @returns { Observable<any> } - An observable that emits the response from the server.
   * @since v1.0.0
   */
  deleteFavorite(favorite_id: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${favorite_id}`, { withCredentials: true });
  }
}