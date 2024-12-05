import { Component, OnInit } from '@angular/core';
import { MoviesService } from '../../services/movies.service';
import { FavoritesService } from '../../services/favorites.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

/**
 * Component for querying and displaying movies.
 * Provides functionality for filtering, sorting, and aggregating movie data.
 * @since v1.0.0
 * @autor Your Name
 */
@Component({
  selector: 'app-query',
  templateUrl: './query.component.html',
  styleUrls: ['./query.component.css']
})
export class QueryComponent implements OnInit {
  /**
   * The list of movies.
   */
  movies: any[] = [];

  /**
   * The list of user's favorite movies.
   */
  favorites: any[] = [];

  /**
   * The list of movies to display on the current page.
   */
  currentMovies: any[] = [];

  /**
   * The user's information.
   */
  userInfo: any = {};

  /**
   * Indicates if the user is an admin.
   */
  is_admin: boolean = false;

  /**
   * The search query string.
   */
  searchQuery: string = '';

  /**
   * The type of query to perform.
   */
  queryType: string = 'id';

  /**
   * The field to sort by.
   */
  sortField: string = 'release_date';

  /**
   * The order to sort in (1 for ascending, -1 for descending).
   */
  sortOrder: number = 1;

  /**
   * The language to filter movies by.
   */
  filterLanguage: string = '';

  /**
   * The criteria for filtering, sorting, or aggregating movies.
   */
  criteria: any = {};

  /**
   * The current page number for pagination.
   */
  currentPage: number = 1;

  /**
   * The total number of pages for pagination.
   */
  totalPages: number = 1;

  /**
   * The number of movies to display per page.
   */
  moviesPerPage: number = 12;

  /**
   * The page number input by the user for jumping to a specific page.
   */
  gotoPageNumber: number = 1;

  /**
   * The total number of movies after aggregation.
   */
  totalMovies: number = 0;

  /**
   * The list of statistics for each language.
   */
  languageStats: any[] = [];

  /**
   * The total average duration of all movies.
   */
  totalAverageDuration: number = 0;

  /**
   * Indicates if the aggregated results should be displayed.
   */
  showAggregatedResults: boolean = false;

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
   * Updates the favorite status of each movie.
   * @since v1.0.0
   */
  updateMovieFavoriteStatus(): void {
    this.movies.forEach(movie => {
      const favorite = this.favorites.find(f => f.movie_id === movie._id);
      if (favorite) {
        movie.isFavorite = true;
        movie.favorite_id = favorite._id;
      } else {
        movie.isFavorite = false;
        delete movie.favorite_id;
      }
    });
  }

  /**
   * Filters movies based on the selected language.
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
   * Sorts movies based on the selected field and order.
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
   * Aggregates movies to calculate total and average statistics.
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
   * Toggles the display of aggregated results.
   * @since v1.0.0
   */
  toggleAggregatedResults(): void {
    this.showAggregatedResults = !this.showAggregatedResults;
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
   * Retrieves the URL of the movie's poster.
   * @param { any } movie - The movie object.
   * @returns { string | undefined } - The URL of the poster image, or a default URL if not found.
   * @since v1.0.0
   */
  getPosterUrl(movie: any): string | undefined {
    const posterUrl = movie.images.find((image: any) => image.type === 'Poster')?.url;
    return posterUrl || '../../../assets/logo.jpg';
  }

  /**
   * Adds a movie to the user's favorites.
   * @param { string } movie_id - The ID of the movie to add to favorites.
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
   * @param { string } favorite_id - The ID of the favorite to remove.
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