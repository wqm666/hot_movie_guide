import { Component, OnInit } from '@angular/core';
import { MoviesService } from '../../services/movies.service';
import { FavoritesService } from '../../services/favorites.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

/**
 * Component for displaying the home page.
 * Handles loading movies, managing favorites, and user information.
 * @since v1.0.0
 * @autor Zirun Wang
 */
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  /**
   * The list of movies.
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
   * Loads movies, favorites, and user information on component initialization.
   * @since v1.0.0
   */
  ngOnInit(): void {
    this.loadMoviesAndFavorites();
    this.getUserInfo();
  }

  /**
   * Loads movies and user's favorite movies.
   * @since v1.0.0
   */
  loadMoviesAndFavorites(): void {
    this.moviesService.getAllMovies().subscribe((movies: any[]) => {
      this.movies = movies;
      this.favoritesService.getUserFavorites().subscribe((favorites: any[]) => {
        this.favorites = favorites;
        this.updateMoviesWithFavorites();
      }, error => {
        console.error('Error fetching favorites:', error);
        this.updateMoviesWithFavorites();
      });
    }, error => {
      console.error('Error fetching movies:', error);
    });
  }

  /**
   * Updates the movies list with favorite status.
   * @since v1.0.0
   */
  updateMoviesWithFavorites(): void {
    this.movies = this.movies.map(movie => {
      const favorite = this.favorites.find(fav => fav.movie_id === movie._id);
      return { ...movie, isFavorite: !!favorite, favorite_id: favorite ? favorite._id : null };
    });
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
   * Adds a movie to the user's favorites.
   * @param { string } movie_id - The ID of the movie to add to favorites.
   * @since v1.0.0
   */
  addToFavorites(movie_id: string): void {
    this.favoritesService.addFavorite(movie_id).subscribe((favorite) => {
      alert('Movie added to favorites');
      const movie = this.movies.find(m => m._id === movie_id);
      if (movie) {
        movie.isFavorite = true;
        movie.favorite_id = favorite._id;
      }
      this.loadMoviesAndFavorites();
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
      const movie = this.movies.find(m => m.favorite_id === favorite_id);
      if (movie) {
        movie.isFavorite = false;
        movie.favorite_id = null;
      }
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
    target.src = '../../../assets/logo.jpg';
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

  /**
   * Calculates the total number of pages for pagination.
   * @returns { number } - The total number of pages.
   * @since v1.0.0
   */
  get totalPages(): number {
    return Math.ceil(this.movies.length / this.moviesPerPage);
  }

  /**
   * Sets the current page number for pagination.
   * @param { number } page - The page number to set.
   * @since v1.0.0
   */
  setCurrentPage(page: number): void {
    this.currentPage = page;
  }

  /**
   * Navigates to the previous page in pagination.
   * @since v1.0.0
   */
  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  /**
   * Navigates to the next page in pagination.
   * @since v1.0.0
   */
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  /**
   * Jumps to a specific page based on user input.
   * @since v1.0.0
   */
  jumpToPage(): void {
    if (this.gotoPageNumber >= 1 && this.gotoPageNumber <= this.totalPages) {
      this.setCurrentPage(this.gotoPageNumber);
    } else {
      alert('Invalid page number');
    }
  }

  /**
   * Retrieves the movies for the current page in pagination.
   * @returns { any[] } - The list of movies for the current page.
   * @since v1.0.0
   */
  get currentMovies(): any[] {
    const startIndex = (this.currentPage - 1) * this.moviesPerPage;
    const endIndex = startIndex + this.moviesPerPage;
    return this.movies.slice(startIndex, endIndex);
  }
}