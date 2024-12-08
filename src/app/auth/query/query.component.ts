import { Component, OnInit } from '@angular/core';
import { MoviesService } from '../../services/movies.service';
import { FavoritesService } from '../../services/favorites.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

/**
 * Component for querying and displaying movies.
 * Provides functionality for filtering, sorting, and aggregating movie data.
 * @since v1.0.0
 * @author Zirun Wang
 */
@Component({
  selector: 'app-query',
  templateUrl: './query.component.html',
  styleUrls: ['./query.component.css']
})
export class QueryComponent implements OnInit {  
  /**
   * The list of all movies fetched from the server.
   * @type {any[]}
   */
  movies: any[] = [];

  /**
   * The list of the user's favorite movies, populated after fetching from the server.
   * @type {any[]}
   */
  favorites: any[] = [];

  /**
   * The list of movies to be displayed based on the current page and filters.
   * @type {any[]}
   */
  currentMovies: any[] = [];

  /**
   * The user's information, fetched from the authentication service.
   * @type {any}
   */
  userInfo: any = {};

  /**
   * Indicates whether the user is an admin.
   * @type {boolean}
   */
  is_admin: boolean = false;

  /**
   * The search query string entered by the user.
   * Used for filtering movies based on title or ID.
   * @type {string}
   */
  searchQuery: string = '';

  /**
   * The type of query to perform (e.g., 'id', 'title').
   * @type {string}
   */
  queryType: string = 'id';

  /**
   * The field to sort movies by (e.g., 'release_date', 'duration').
   * @type {string}
   */
  sortField: string = 'release_date';

  /**
   * The order to sort the movies in (1 for ascending, -1 for descending).
   * @type {number}
   */
  sortOrder: number = 1;

  /**
   * The language to filter movies by. If empty, no language filter is applied.
   * @type {string}
   */
  filterLanguage: string = '';

  /**
   * The current page number in the pagination system.
   * @type {number}
   */
  currentPage: number = 1;

  /**
   * The total number of pages available based on the number of movies.
   * @type {number}
   */
  totalPages: number = 1;

  /**
   * The number of movies to display per page.
   * @type {number}
   */
  moviesPerPage: number = 12;

  /**
   * The page number input by the user for jumping to a specific page.
   * @type {number}
   */
  gotoPageNumber: number = 1;

  /**
   * The total number of movies after aggregation.
   * @type {number}
   */
  totalMovies: number = 0;

  /**
   * The statistics for movies grouped by language, including total count and average duration.
   * @type {any[]}
   */
  languageStats: any[] = [];

  /**
   * The total average duration of all movies.
   * @type {number}
   */
  totalAverageDuration: number = 0;

  /**
   * Indicates whether the aggregated results (like total and average statistics) should be displayed.
   * @type {boolean}
   */
  showAggregatedResults: boolean = false;
  
  /**
   * @constructor
   * @param {MoviesService} moviesService - The service used for fetching movies.
   * @param {FavoritesService} favoritesService - The service used for managing favorite movies.
   * @param {AuthService} authService - The authentication service used for fetching user info.
   * @param {Router} router - The router service used for navigation.
   */
  constructor(
    private moviesService: MoviesService,
    private favoritesService: FavoritesService,
    private authService: AuthService,
    private router: Router
  ) { }
  
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
   * Sets the `userInfo` and `is_admin` properties based on the response.
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
   * Fetches the user's favorite movies from the server and updates the `favorites` list.
   * If no favorites are found, it initializes an empty array.
   * @since v1.0.0
   */
  getUserFavorites(): void {
    this.favoritesService.getUserFavorites().subscribe(favorites => {
      this.favorites = favorites;
      if (this.favorites.length > 0) {
        this.updateMovieFavoriteStatus();
      }
    }, error => {
      if (error.status === 404) {
        this.favorites = [];
      } else {
        console.error('Error fetching favorites:', error);
      }
    });
  }

  /**
   * Loads all movies from the server.
   * After loading, updates the favorite status for each movie and handles pagination.
   * @since v1.0.0
   */
  loadMovies(): void {
    this.moviesService.getAllMovies().subscribe(movies => {
      this.movies = movies;
      this.updateMovieFavoriteStatus();
      this.updatePagination();
    }, error => {
      console.error('Error fetching movies:', error);
    });
  }

  /**
   * Updates the favorite status of each movie based on the `favorites` list.
   * Movies found in `favorites` will have `isFavorite` set to true.
   * @since v1.0.0
   */
  updateMovieFavoriteStatus(): void {
    this.movies.forEach(movie => {
      const favorite = this.favorites.find(f => f.movie_id === movie._id);
      movie.isFavorite = !!favorite;
      movie.favorite_id = favorite ? favorite._id : null;
    });
  }

  /**
   * Filters the movies by the selected language.
   * If the language filter is set, only movies with the specified language will be displayed.
   * @since v1.0.0
   */
  filterMovies(): void {
    const criteria = { language: this.filterLanguage };
    this.moviesService.filterMovies(criteria).subscribe(movies => {
      this.movies = movies;
      this.updateMovieFavoriteStatus();
      this.updatePagination();
    }, error => {
      console.error('Error filtering movies:', error);
      this.movies = [];
      this.updatePagination();
    });
  }

  /**
   * Sorts the movies based on the selected field and order.
   * Sort order can be ascending (1) or descending (-1).
   * @since v1.0.0
   */
  sortMovies(): void {
    const criteria = { [this.sortField]: Number(this.sortOrder) };
    this.moviesService.sortMovies(criteria).subscribe(movies => {
      this.movies = movies;
      this.updateMovieFavoriteStatus();
      this.updatePagination();
    }, error => {
      console.error('Error sorting movies:', error);
      this.movies = [];
      this.updatePagination();
    });
  }

  /**
   * Aggregates movies to calculate total and average statistics for each language.
   * Displays the total number of movies and the average duration of movies per language.
   * @since v1.0.0
   */
  aggregateMovies(): void {
    const criteria = [
      { $group: { _id: "$language", total_movies: { $sum: 1 }, average_duration: { $avg: "$duration" } } }
    ];
    this.moviesService.aggregateMovies(criteria).subscribe(results => {
      this.totalMovies = results.reduce((sum, item) => sum + item.total_movies, 0);
      this.totalAverageDuration = results.reduce((sum, item) => sum + item.average_duration * item.total_movies, 0) / this.totalMovies;
      this.languageStats = results;
      this.showAggregatedResults = true;
    }, error => {
      console.error('Error aggregating movies:', error);
      this.totalMovies = 0;
      this.languageStats = [];
      this.showAggregatedResults = false;
    });
  }

  /**
   * Toggles the display of aggregated results, such as the total number of movies and average duration.
   * @since v1.0.0
   */
  toggleAggregatedResults(): void {
    this.showAggregatedResults = !this.showAggregatedResults;
  }

  /**
   * Updates the pagination information based on the current set of movies.
   * It calculates the total number of pages and the movies to display on the current page.
   * @since v1.0.0
   */
  updatePagination(): void {
    this.totalPages = Math.ceil(this.movies.length / this.moviesPerPage);
    this.currentMovies = this.movies.slice((this.currentPage - 1) * this.moviesPerPage, this.currentPage * this.moviesPerPage);
  }

  /**
   * Navigates to the next page in the pagination system.
   * If the current page is the last page, it does nothing.
   * @since v1.0.0
   */
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  /**
   * Navigates to the previous page in the pagination system.
   * If the current page is the first page, it does nothing.
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
   * If the page number is invalid, it shows an alert.
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
   * Retrieves the URL of the movie's poster image.
   * If no poster is found, returns a default placeholder image.
   * @param {any} movie - The movie object.
   * @returns {string} - The URL of the poster image, or a default image.
   * @since v1.0.0
   */
  getPosterUrl(movie: any): string | undefined {
    const posterUrl = movie.images.find((image: any) => image.type === 'Poster')?.url;
    return posterUrl || '../../../assets/logo.jpg';
  }

  /**
   * Adds a movie to the user's favorites.
   * After adding, it refreshes the list of favorites.
   * @param {string} movie_id - The ID of the movie to add to favorites.
   * @since v1.0.0
   */
  addToFavorites(movie_id: string): void {
    this.favoritesService.addFavorite(movie_id).subscribe(() => {
      alert('Movie added to favorites');
      this.getUserFavorites();
    }, error => {
      console.error('Error adding to favorites:', error);
      alert('Add favorites failed');
    });
  }

  /**
   * Removes a movie from the user's favorites.
   * After removal, it refreshes the list of favorites.
   * @param {string} favorite_id - The ID of the favorite to remove.
   * @since v1.0.0
   */
  removeFromFavorites(favorite_id: string): void {
    this.favoritesService.deleteFavorite(favorite_id).subscribe(() => {
      alert('Movie removed from favorites');
      this.getUserFavorites();
    }, error => {
      console.error('Error removing from favorites:', error);
      alert('Remove favorites failed');
    });
  }

  /**
   * Logs out the user and navigates to the login page.
   * Clears the session token and redirects to the login route.
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
}