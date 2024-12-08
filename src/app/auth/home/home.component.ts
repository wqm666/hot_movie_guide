import { Component, OnInit } from '@angular/core';
import { MoviesService } from '../../services/movies.service';
import { FavoritesService } from '../../services/favorites.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

/**
 * Component for displaying the home page.
 * Handles loading movies, managing favorites, and displaying user information.
 * The component supports displaying a list of movies, managing the user's favorite movies,
 * and providing pagination controls for the movie list.
 * @since v1.0.0
 * @author Zirun Wang
 */
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  /**
   * The list of movies fetched from the server.
   * @type {any[]}
   */
  movies: any[] = [];

  /**
   * The list of user's favorite movies fetched from the server.
   * @type {any[]}
   */
  favorites: any[] = [];

  /**
   * The user's information fetched from the server.
   * Includes details like user name and admin status.
   * @type {any}
   */
  userInfo: any = {};

  /**
   * Indicates if the user is an admin. 
   * This value is used to display admin-specific UI elements.
   * @type {boolean}
   */
  is_admin: boolean = false;

  /**
   * The current page number for pagination.
   * This value determines which page of movies to display.
   * @type {number}
   */
  currentPage: number = 1;

  /**
   * The number of movies per page for pagination.
   * This determines how many movies are displayed on each page.
   * @type {number}
   */
  moviesPerPage: number = 12;

  /**
   * The page number input by the user for jumping to a specific page.
   * This allows users to directly navigate to any page of movies.
   * @type {number}
   */
  gotoPageNumber: number = 1;

  /**
   * @constructor
   * @param { MoviesService } moviesService - The service used for fetching movie data.
   * @param { FavoritesService } favoritesService - The service used for managing user favorites.
   * @param { AuthService } authService - The service used for fetching user information.
   * @param { Router } router - The router service used for navigation actions like logout.
   */
  constructor(
    private moviesService: MoviesService,
    private favoritesService: FavoritesService,
    private authService: AuthService,
    private router: Router
  ) { }

  /**
   * Lifecycle hook that is called after data-bound properties are initialized.
   * Loads movies, favorites, and user information on component initialization.
   * Fetches data from the backend and initializes the page.
   * @since v1.0.0
   */
  ngOnInit(): void {
    this.loadMoviesAndFavorites();
    this.getUserInfo();
  }

  /**
   * Loads both movies and the user's favorite movies.
   * This function first fetches the list of movies, then fetches the user's favorites,
   * and finally updates the movies list to indicate which movies are favorites.
   * If an error occurs while fetching favorites, the movie list is still updated.
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
   * Updates the movies list by adding a favorite status.
   * Each movie in the list is checked against the user's favorites, and a flag `isFavorite`
   * is set to true for movies that are in the user's favorites.
   * This method is invoked after fetching both movies and favorites.
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
   * The information includes details like username, email, and admin status.
   * On success, updates `userInfo` and `is_admin`.
   * On failure, logs an error to the console.
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
   * Sends the movie ID to the backend to add it to the favorites list.
   * Upon success, updates the movie list and sets the `isFavorite` flag for the movie.
   * Displays an alert to confirm the action to the user.
   * On failure, logs the error and shows an alert indicating failure.
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
   * Sends the favorite ID to the backend to remove it from the favorites list.
   * Upon success, updates the movie list and resets the `isFavorite` flag for the movie.
   * Displays an alert to confirm the action to the user.
   * On failure, logs the error and shows an alert indicating failure.
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
   * Logs out the user and redirects to the login page.
   * Clears the session token and performs the logout action using the AuthService.
   * Displays an alert indicating the success or failure of the logout action.
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
   * Retrieves the URL of the movie's poster image.
   * The URL is extracted from the `images` array of the movie object, where the type is 'Poster'.
   * If no poster image is found, a default image URL is returned.
   * @param { any } movie - The movie object.
   * @returns { string | undefined } - The URL of the poster image, or a default image if not found.
   * @since v1.0.0
   */
  getPosterUrl(movie: any): string | undefined {
    const posterUrl = movie.images.find((image: any) => image.type === 'Poster')?.url;
    return posterUrl || '../../../assets/logo.jpg';
  }

  /**
   * Calculates the total number of pages for pagination.
   * The number of pages is determined by dividing the total number of movies by the number of movies per page.
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
   * Decreases the current page number by 1 if it is greater than 1.
   * @since v1.0.0
   */
  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  /**
   * Navigates to the next page in pagination.
   * Increases the current page number by 1 if it is less than the total number of pages.
   * @since v1.0.0
   */
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  /**
   * Jumps to a specific page based on user input.
   * Validates the page number input and updates the current page if valid.
   * If the page number is invalid, an alert is displayed to the user.
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
   * Retrieves the list of movies for the current page based on the current page number and pagination settings.
   * @returns { any[] } - The list of movies for the current page.
   * @since v1.0.0
   */
  get currentMovies(): any[] {
    const startIndex = (this.currentPage - 1) * this.moviesPerPage;
    const endIndex = startIndex + this.moviesPerPage;
    return this.movies.slice(startIndex, endIndex);
  }
}