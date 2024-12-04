import { Component, OnInit } from '@angular/core';
import { MoviesService } from '../../services/movies.service';
import { FavoritesService } from '../../services/favorites.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

/**
 * Component for displaying and managing user's favorite movies.
 * Handles loading favorite movies, pagination, and user interactions.
 * @since v1.0.0
 * @autor Zirun Wang
 */
@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css']
})
export class FavoritesComponent implements OnInit {
  /**
   * The list of all movies.
   */
  movies: any[] = [];

  /**
   * The list of user's favorite movies.
   */
  favorites: any[] = [];

  /**
   * The user's information.
   */
  userInfo: any = {};

  /**
   * Indicates if the user is an admin.
   */
  is_admin: boolean = false;

  /**
   * The current page number for pagination.
   */
  currentPage: number = 1;

  /**
   * The number of movies per page for pagination.
   */
  moviesPerPage: number = 12;

  /**
   * The page number input by the user for jumping to a specific page.
   */
  gotoPageNumber: number = 1;

  /**
   * The total number of pages for pagination.
   */
  totalPages: number = 1;

  /**
   * The list of movies to display on the current page.
   */
  currentMovies: any[] = [];

  /**
   * @constructor
   * @param { MoviesService } moviesService - The service used for fetching movies.
   * @param { FavoritesService } favoritesService - The service used for managing favorite movies.
   * @param { AuthService } authService - The authentication service used for fetching user info.
   * @param { Router } router - The router service used for navigation.
   */
  constructor(
    private moviesService: MoviesService,
    private favoritesService: FavoritesService,
    private authService: AuthService,
    private router: Router
  ) {}

  /**
   * Lifecycle hook that is called after data-bound properties are initialized.
   * Fetches user information and user's favorite movies on component initialization.
   * @since v1.0.0
   */
  ngOnInit(): void {
    this.getUserInfo();
    this.getUserFavorites();
  }

  /**
   * Fetches the user's information from the server.
   * @since v1.0.0
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
   * Fetches the user's favorite movies from the server.
   * @since v1.0.0
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
   * Loads the user's favorite movies.
   * @since v1.0.0
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
   * Updates the pagination information.
   * @since v1.0.0
   */
  updatePagination(): void {
    this.totalPages = Math.ceil(this.movies.length / this.moviesPerPage);
    this.currentMovies = this.movies.slice((this.currentPage - 1) * this.moviesPerPage, this.currentPage * this.moviesPerPage);
  }

  /**
   * Navigates to the next page in pagination.
   * @since v1.0.0
   */
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  /**
   * Navigates to the previous page in pagination.
   * @since v1.0.0
   */
  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  /**
   * Jumps to a specific page based on user input.
   * @since v1.0.0
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
   * Adds a movie to the user's favorites.
   * @param { string } movie_id - The ID of the movie to add to favorites.
   * @since v1.0.0
   */
  addToFavorites(movie_id: string): void {
    this.favoritesService.addFavorite(movie_id).subscribe((favorite) => {
      alert('Movie added to favorites');
      this.loadFavoriteMovies();
    }, error => {
      console.error('Error adding to favorites:', error);
      alert('Add favorites failed');
    });
  }

  /**
   * Removes a movie from the user's favorites.
   * @param { string } favorite_id - The ID of the favorite to remove.
   * @since v1.0.0
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
   * Logs out the user and navigates to the login page.
   * @since v1.0.0
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
   * Handles the error event for movie images.
   * Sets a default image if the original image fails to load.
   * @param { Event } event - The error event.
   * @since v1.0.0
   */
  handleImageError(event: Event) {
    const target = event.target as HTMLImageElement;
    target.src = '../../../assets/logo.jpg';  // 设置默认图片路径
  }

  /**
   * Retrieves the URL of the movie's poster.
   * @param { any } movie - The movie object.
   * @returns { string | undefined } - The URL of the poster image.
   * @since v1.0.0
   */
  getPosterUrl(movie: any): string | undefined {
    return movie.images.find((image: any) => image.type === 'Poster')?.url;
  }
}