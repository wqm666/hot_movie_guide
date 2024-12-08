import { Component, OnInit } from '@angular/core';
import { MoviesService } from '../../services/movies.service';
import { FavoritesService } from '../../services/favorites.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

/**
 * Component for displaying and managing user's favorite movies.
 * Handles loading favorite movies, pagination, and user interactions.
 * @since v1.0.0
 * @author Zirun Wang
 */
@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css']
})
export class FavoritesComponent implements OnInit {
  /**
   * The list of all movies loaded from the user's favorites.
   */
  movies: any[] = [];

  /**
   * The list of user's favorite movies metadata.
   * Each entry includes the `movie_id` and favorite record details.
   */
  favorites: any[] = [];

  /**
   * The authenticated user's information.
   * Includes user-specific data such as roles and permissions.
   */
  userInfo: any = {};

  /**
   * Indicates if the authenticated user has admin privileges.
   */
  is_admin: boolean = false;

  /**
   * The current page number in the pagination view.
   * Starts at 1 and increments or decrements based on user interaction.
   */
  currentPage: number = 1;

  /**
   * The number of movies displayed per page in the pagination view.
   * Defaults to 12 items per page.
   */
  moviesPerPage: number = 12;

  /**
   * The page number entered by the user for direct navigation.
   * Used in conjunction with the `jumpToPage` method.
   */
  gotoPageNumber: number = 1;

  /**
   * The total number of pages calculated for the pagination view.
   * Derived from the total number of movies divided by `moviesPerPage`.
   */
  totalPages: number = 1;

  /**
   * The list of movies currently displayed on the current page.
   * This array updates dynamically based on pagination state.
   */
  currentMovies: any[] = [];

  /**
   * Initializes the component and its dependencies.
   * @param {MoviesService} moviesService - The service used for fetching movie data.
   * @param {FavoritesService} favoritesService - The service used for managing favorite movies.
   * @param {AuthService} authService - The service used for user authentication and information retrieval.
   * @param {Router} router - The Angular router used for navigation.
   */
  constructor(
    private moviesService: MoviesService,
    private favoritesService: FavoritesService,
    private authService: AuthService,
    private router: Router
  ) {}

  /**
   * Angular lifecycle hook invoked after the component's data-bound properties are initialized.
   * Responsible for initializing user data and loading favorite movies.
   */
  ngOnInit(): void {
    this.getUserInfo();
    this.getUserFavorites();
  }

  /**
   * Retrieves authenticated user information from the server.
   * Updates the `userInfo` and `is_admin` properties based on the response.
   */
  getUserInfo(): void {
    this.authService.getUserInfo().subscribe(data => {
      this.userInfo = data;
      this.is_admin = this.userInfo.is_admin;
    }, error => {
      console.error('Error fetching user info:', error);
    });
  }

  /**
   * Fetches the user's favorite movies metadata from the server.
   * Invokes the `loadFavoriteMovies` method if favorites exist.
   */
  getUserFavorites(): void {
    this.favoritesService.getUserFavorites().subscribe(favorites => {
      this.favorites = favorites;
      if (this.favorites.length > 0) {
        this.loadFavoriteMovies();
      }
      this.updatePagination();
    }, error => {
      if (error.status === 404) {
        this.favorites = [];
        this.updatePagination();
      } else {
        console.error('Error fetching favorites:', error);
      }
    });
  }

  /**
   * Loads detailed movie data for all favorite movies.
   * Uses the `moviesService` to fetch movie details based on `movie_id` from the `favorites` list.
   * Updates the `movies` array with detailed movie data.
   */
  loadFavoriteMovies(): void {
    this.movies = [];
    this.favorites.forEach(favorite => {
      this.moviesService.getMovieById(favorite.movie_id).subscribe(movie => {
        this.movies.push({ ...movie, favorite_id: favorite._id, isFavorite: true });
        this.updatePagination();
      }, error => {
        console.error('Error fetching movie:', error);
      });
    });
  }

  /**
   * Updates pagination-related properties.
   * Calculates `totalPages` based on the total number of movies and the per-page count.
   * Updates `currentMovies` based on the current page.
   */
  updatePagination(): void {
    this.totalPages = Math.ceil(this.movies.length / this.moviesPerPage);
    this.currentMovies = this.movies.slice((this.currentPage - 1) * this.moviesPerPage, this.currentPage * this.moviesPerPage);
  }

  /**
   * Navigates to the next page in the pagination view.
   * Updates the `currentPage` and refreshes `currentMovies`.
   */
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  /**
   * Navigates to the previous page in the pagination view.
   * Updates the `currentPage` and refreshes `currentMovies`.
   */
  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  /**
   * Directly jumps to a specific page number in the pagination view.
   * Validates the page number entered by the user.
   */
  jumpToPage(): void {
    if (this.gotoPageNumber >= 1 && this.gotoPageNumber <= this.totalPages) {
      this.currentPage = this.gotoPageNumber;
      this.updatePagination();
    } else {
      alert('Invalid page number');
    }
  }

  /**
   * Adds a specific movie to the user's favorites.
   * @param {string} movie_id - The ID of the movie to be added to the favorites list.
   */
  addToFavorites(movie_id: string): void {
    this.favoritesService.addFavorite(movie_id).subscribe(() => {
      alert('Movie added to favorites');
      this.loadFavoriteMovies();
    }, error => {
      console.error('Error adding to favorites:', error);
      alert('Add favorites failed');
    });
  }

  /**
   * Removes a specific movie from the user's favorites.
   * @param {string} favorite_id - The ID of the favorite record to be removed.
   */
  removeFromFavorites(favorite_id: string): void {
    this.favoritesService.deleteFavorite(favorite_id).subscribe(() => {
      alert('Movie removed from favorites');
      this.movies = this.movies.filter(movie => movie.favorite_id !== favorite_id);
      this.updatePagination();
    }, error => {
      console.error('Error removing from favorites:', error);
      alert('Remove favorites failed');
    });
  }

  /**
   * Logs out the current user and navigates to the login page.
   * Clears the session storage to remove the authentication token.
   */
  logout(): void {
    this.authService.logout().subscribe(() => {
      sessionStorage.removeItem('token');
      this.router.navigate(['/login']);
      alert('Logout successfully');
    }, error => {
      console.error('Error logging out:', error);
      alert('Logout failed');
    });
  }

  /**
   * Retrieves the URL of the poster image for a given movie.
   * If no valid poster URL is found, returns a default image URL.
   * @param {any} movie - The movie object containing image metadata.
   * @returns {string | undefined} - The poster URL or a default image path.
   */
  getPosterUrl(movie: any): string | undefined {
    const posterUrl = movie.images.find((image: any) => image.type === 'Poster')?.url;
    return posterUrl || '../../../assets/logo.jpg';
  }
}