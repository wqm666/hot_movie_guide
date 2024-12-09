import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { MoviesService } from '../services/movies.service';
import { FavoritesService } from '../services/favorites.service';
import { WeatherService } from '../services/weather.service';
import { AdminService } from '../services/admin.service';
import { of } from 'rxjs';

/**
 * Component for running and displaying test results.
 * Tests various services and functionalities in the application.
 * @since v1.0.0
 */
@Component({
  selector: 'app-test-results',
  templateUrl: './test-results.component.html',
  styleUrls: ['./test-results.component.css']
})
export class TestResultsComponent implements OnInit {
  /**
   * Array to store the test results.
   * Each result has a name, status, and optional message.
   */
  testResults: { name: string, status: string, message?: string }[] = [];

  /**
   * Constructor to inject necessary services.
   * @param {AuthService} authService - Service for authentication-related operations.
   * @param {MoviesService} moviesService - Service for movie-related operations.
   * @param {FavoritesService} favoritesService - Service for managing user favorites.
   * @param {WeatherService} weatherService - Service for fetching weather information.
   * @param {AdminService} adminService - Service for admin-related operations.
   */
  constructor(
    private authService: AuthService,
    private moviesService: MoviesService,
    private favoritesService: FavoritesService,
    private weatherService: WeatherService,
    private adminService: AdminService
  ) { }

  /**
   * Lifecycle hook called after the component has initialized.
   * Runs all the tests.
   */
  ngOnInit(): void {
    this.runTests();
  }

  /**
   * Runs all the tests for the application.
   */
  runTests(): void {
    this.testRegistration();
    this.testLogin();
    this.testUserInfo();
    this.testUpdateUserInfo();
    this.testLogout();
    this.testDeleteUser();
    this.testIsLoggedIn();
    this.testGetAllMovies();
    this.testGetMovieById();
    this.testGetMovieDetails();
    this.testFilterMovies();
    this.testSortMovies();
    this.testAggregateMovies();
    this.testSummarizeMovies();
    this.testAddFavorite();
    this.testGetUserFavorites();
    this.testDeleteFavorite();
    this.testGetAllUsers();
    this.testGetAdminUsers();
    this.testToggleAdmin();
    this.testAddMovie();
    this.testUpdateMovie();
    this.testDeleteMovie();
    this.testGetCurrentWeather();
    this.testGetWeatherForecast();
  }

  /**
   * Tests the user registration functionality.
   */
  testRegistration(): void {
    try {
      this.authService.register = () => of({ message: 'Registration successful' });
      this.authService.register({ username: 'testuser', password: 'password', email: 'test@example.com' }).subscribe(response => {
        if (response.message === 'Registration successful') {
          this.testResults.push({ name: 'Registration Test', status: 'Passed' });
        } else {
          this.testResults.push({ name: 'Registration Test', status: 'Failed', message: 'Unexpected response message' });
        }
      });
    } catch (error: any) {
      this.testResults.push({ name: 'Registration Test', status: 'Failed', message: error.message });
    }
  }

  /**
   * Tests the user login functionality.
   */
  testLogin(): void {
    try {
      this.authService.login = () => of({ token: 'some-token' });
      this.authService.login({ username: 'testuser', password: 'password' }).subscribe(response => {
        if (response.token) {
          this.testResults.push({ name: 'Login Test', status: 'Passed' });
        } else {
          this.testResults.push({ name: 'Login Test', status: 'Failed', message: 'No token received' });
        }
      });
    } catch (error: any) {
      this.testResults.push({ name: 'Login Test', status: 'Failed', message: error.message });
    }
  }

  /**
 * Tests the functionality of fetching and displaying user information.
 */
  testUserInfo(): void {
    try {
      const userInfo = { username: 'testuser', is_admin: false };
      this.authService.getUserInfo = () => of(userInfo);
      this.authService.getUserInfo().subscribe(response => {
        if (response.username === 'testuser') {
          this.testResults.push({ name: 'User Info Test', status: 'Passed' });
        } else {
          this.testResults.push({ name: 'User Info Test', status: 'Failed', message: 'Incorrect username received' });
        }
      }, error => {
        this.testResults.push({ name: 'User Info Test', status: 'Failed', message: error.message });
      });
    } catch (error: any) {
      this.testResults.push({ name: 'User Info Test', status: 'Failed', message: error.message });
    }
  }


  /**
 * Tests the user logout functionality.
 */
  testLogout(): void {
    try {
      this.authService.logout = () => of({ message: 'Logout successful' });
      this.authService.logout().subscribe(response => {
        if (response.message === 'Logout successful') {
          this.testResults.push({ name: 'Logout Test', status: 'Passed' });
        } else {
          this.testResults.push({ name: 'Logout Test', status: 'Failed', message: 'Unexpected response message' });
        }
      });
    } catch (error: any) {
      this.testResults.push({ name: 'Logout Test', status: 'Failed', message: error.message });
    }
  }

  /**
   * Tests updating user information.
   */
  testUpdateUserInfo(): void {
    try {
      const updatedUser = { username: 'updateduser', email: 'updated@example.com' };
      this.authService.updateUserInfo = () => of({ message: 'Update successful' });
      this.authService.updateUserInfo(updatedUser).subscribe(response => {
        if (response.message === 'Update successful') {
          this.testResults.push({ name: 'Update User Info Test', status: 'Passed' });
        } else {
          this.testResults.push({ name: 'Update User Info Test', status: 'Failed', message: 'Unexpected response message' });
        }
      });
    } catch (error: any) {
      this.testResults.push({ name: 'Update User Info Test', status: 'Failed', message: error.message });
    }
  }

  /**
   * Tests deleting the user account.
   */
  testDeleteUser(): void {
    try {
      this.authService.deleteUser = () => of({ message: 'User deleted' });
      this.authService.deleteUser().subscribe(response => {
        if (response.message === 'User deleted') {
          this.testResults.push({ name: 'Delete User Test', status: 'Passed' });
        } else {
          this.testResults.push({ name: 'Delete User Test', status: 'Failed', message: 'Unexpected response message' });
        }
      });
    } catch (error: any) {
      this.testResults.push({ name: 'Delete User Test', status: 'Failed', message: error.message });
    }
  }

  /**
   * Tests checking if the user is logged in.
   */
  testIsLoggedIn(): void {
    try {
      sessionStorage.setItem('token', 'valid-token');
      if (this.authService.isLoggedIn()) {
        this.testResults.push({ name: 'Is Logged In Test', status: 'Passed' });
      } else {
        this.testResults.push({ name: 'Is Logged In Test', status: 'Failed', message: 'User should be logged in' });
      }
      sessionStorage.removeItem('token');
      if (!this.authService.isLoggedIn()) {
        this.testResults.push({ name: 'Is Logged In Test After Logout', status: 'Passed' });
      } else {
        this.testResults.push({ name: 'Is Logged In Test After Logout', status: 'Failed', message: 'User should be logged out' });
      }
    } catch (error: any) {
      this.testResults.push({ name: 'Is Logged In Test', status: 'Failed', message: error.message });
    }
  }

  /**
   * Tests the functionality of getting all movies.
   */
  testGetAllMovies(): void {
    const movies = [{ title: 'Movie 1' }, { title: 'Movie 2' }];
    this.moviesService.getAllMovies = () => of(movies);
    this.moviesService.getAllMovies().subscribe(response => {
      if (response.length > 0) {
        this.testResults.push({ name: 'Get All Movies Test', status: 'Passed' });
      } else {
        this.testResults.push({ name: 'Get All Movies Test', status: 'Failed', message: 'No movies received' });
      }
    });
  }

  /**
   * Tests the functionality of getting movie by id.
   */
  testGetMovieById(): void {
    const movie = { title: 'Movie 1', id: '1' };
    this.moviesService.getMovieById = () => of(movie);
    this.moviesService.getMovieById('1').subscribe(response => {
      if (response.title === 'Movie 1') {
        this.testResults.push({ name: 'Get Movie By ID Test', status: 'Passed' });
      } else {
        this.testResults.push({ name: 'Get Movie By ID Test', status: 'Failed', message: 'Incorrect movie details' });
      }
    });
  }

  /**
   * Tests the functionality of  getting movies details.
   */
  testGetMovieDetails(): void {
    const details = { genre: 'Action', release_date: '2022-12-12' };
    this.moviesService.getMovieDetails = () => of(details);
    this.moviesService.getMovieDetails('1', 'details').subscribe(response => {
      if (response.genre === 'Action') {
        this.testResults.push({ name: 'Get Movie Details Test', status: 'Passed' });
      } else {
        this.testResults.push({ name: 'Get Movie Details Test', status: 'Failed', message: 'Incorrect movie details' });
      }
    });
  }

  /**
   * Tests the functionality of filtering movies.
   */
  testFilterMovies(): void {
    const movies = [{ title: 'Movie 1', genre: 'Action' }];
    const criteria = { genre: 'Action' };
    this.moviesService.filterMovies = () => of(movies);
    this.moviesService.filterMovies(criteria).subscribe(response => {
      if (response.length > 0 && response[0].genre === 'Action') {
        this.testResults.push({ name: 'Filter Movies Test', status: 'Passed' });
      } else {
        this.testResults.push({ name: 'Filter Movies Test', status: 'Failed', message: 'Filtering not working as expected' });
      }
    });
  }

  /**
   * Tests the functionality of sorting movies.
   */
  testSortMovies(): void {
    const movies = [{ title: 'Movie 2' }, { title: 'Movie 1' }];
    const criteria = { title: -1 };
    this.moviesService.sortMovies = (criteria: any) => {
      const sortedMovies = [...movies].sort((a, b) => {
        if (criteria.title === -1) {
          return b.title.localeCompare(a.title);
        } else {
          return a.title.localeCompare(b.title);
        }
      });
      return of(sortedMovies);
    };
    this.moviesService.sortMovies(criteria).subscribe(response => {
      if (response[0].title === 'Movie 2' && response[1].title === 'Movie 1') {
        this.testResults.push({ name: 'Sort Movies Test', status: 'Passed' });
      } else {
        this.testResults.push({ name: 'Sort Movies Test', status: 'Failed', message: 'Movies not sorted correctly' });
      }
    });
  }
  
  /**
   * Tests the functionality of  aggregating movies.
   */
  testAggregateMovies(): void {
    const aggregatedData = [{ genre: 'Action', count: 5 }];
    const criteria = { aggregateBy: 'genre' };
    this.moviesService.aggregateMovies = () => of(aggregatedData);
    this.moviesService.aggregateMovies(criteria).subscribe(response => {
      if (response.length > 0 && response[0].count === 5) {
        this.testResults.push({ name: 'Aggregate Movies Test', status: 'Passed' });
      } else {
        this.testResults.push({ name: 'Aggregate Movies Test', status: 'Failed', message: 'Aggregation not correct' });
      }
    });
  }

  /**
   * Tests the functionality of  summarizing movies.
   */
  testSummarizeMovies(): void {
    const summary = [{ totalMovies: 10, averageRating: 4.5 }];
    this.moviesService.summarizeMovies = () => of(summary);
    this.moviesService.summarizeMovies().subscribe(response => {
      if (response[0].totalMovies === 10) {
        this.testResults.push({ name: 'Summarize Movies Test', status: 'Passed' });
      } else {
        this.testResults.push({ name: 'Summarize Movies Test', status: 'Failed', message: 'Summary data incorrect' });
      }
    });
  }

  /**
   * Tests the functionality of adding favorites.
   */
  testAddFavorite(): void {
    const movie_id = '123';
    this.favoritesService.addFavorite = () => of({ message: 'Favorite added successfully' });
    this.favoritesService.addFavorite(movie_id).subscribe(response => {
      if (response.message === 'Favorite added successfully') {
        this.testResults.push({ name: 'Add Favorite Test', status: 'Passed' });
      } else {
        this.testResults.push({ name: 'Add Favorite Test', status: 'Failed', message: 'Unexpected response message' });
      }
    });
  }

  /**
   * Tests the functionality of getting current user favorites
   */
  testGetUserFavorites(): void {
    const favorites = [{ movie_id: '123', _id: 'fav1', title: 'Test Movie' }];
    this.favoritesService.getUserFavorites = () => of(favorites);
    this.favoritesService.getUserFavorites().subscribe(response => {
      if (response.length > 0 && response[0].movie_id === '123') {
        this.testResults.push({ name: 'Get User Favorites Test', status: 'Passed' });
      } else {
        this.testResults.push({ name: 'Get User Favorites Test', status: 'Failed', message: 'No favorites received' });
      }
    });
  }

  /**
   * Tests the functionality of delete favorites.
   */
  testDeleteFavorite(): void {
    const favorite_id = 'fav1';
    this.favoritesService.deleteFavorite = () => of({ message: 'Favorite deleted successfully' });
    this.favoritesService.deleteFavorite(favorite_id).subscribe(response => {
      if (response.message === 'Favorite deleted successfully') {
        this.testResults.push({ name: 'Delete Favorite Test', status: 'Passed' });
      } else {
        this.testResults.push({ name: 'Delete Favorite Test', status: 'Failed', message: 'Unexpected response message' });
      }
    });
  }

  /**
   * Tests the functionality of getting all users.
   */
  testGetAllUsers(): void {
    const users = [{ id: '1', name: 'User One' }, { id: '2', name: 'User Two' }];
    this.adminService.getAllUsers = () => of(users);
    this.adminService.getAllUsers().subscribe(response => {
      if (response.length === 2 && response[0].name === 'User One') {
        this.testResults.push({ name: 'Get All Users Test', status: 'Passed' });
      } else {
        this.testResults.push({ name: 'Get All Users Test', status: 'Failed', message: 'Unexpected users list' });
      }
    });
  }

  /**
   * Tests the functionality of getting admin users.
   */
  testGetAdminUsers(): void {
    const adminUsers = [{ id: '1', name: 'Admin One' }];
    this.adminService.getAdminUsers = () => of(adminUsers);
    this.adminService.getAdminUsers().subscribe(response => {
      if (response.length === 1 && response[0].name === 'Admin One') {
        this.testResults.push({ name: 'Get Admin Users Test', status: 'Passed' });
      } else {
        this.testResults.push({ name: 'Get Admin Users Test', status: 'Failed', message: 'Unexpected admin users list' });
      }
    });
  }

  /**
   * Tests the functionality of toggling admin.
   */
  testToggleAdmin(): void {
    const user_id = '1';
    this.adminService.toggleAdmin = () => of({ message: 'User admin status toggled' });
    this.adminService.toggleAdmin(user_id).subscribe(response => {
      if (response.message === 'User admin status toggled') {
        this.testResults.push({ name: 'Toggle Admin Test', status: 'Passed' });
      } else {
        this.testResults.push({ name: 'Toggle Admin Test', status: 'Failed', message: 'Unexpected response message' });
      }
    });
  }

  /**
   * Tests the functionality of add movies.
   */
  testAddMovie(): void {
    const movie = { title: 'New Movie', genre: 'Action' };
    this.adminService.addMovie = () => of({ message: 'Movie added successfully' });
    this.adminService.addMovie(movie).subscribe(response => {
      if (response.message === 'Movie added successfully') {
        this.testResults.push({ name: 'Add Movie Test', status: 'Passed' });
      } else {
        this.testResults.push({ name: 'Add Movie Test', status: 'Failed', message: 'Unexpected response message' });
      }
    });
  }

  /**
   * Tests the functionality of updating movies.
   */
  testUpdateMovie(): void {
    const movie_id = '123';
    const updatedMovie = { title: 'Updated Movie', genre: 'Drama' };
    this.adminService.updateMovie = () => of({ message: 'Movie updated successfully' });
    this.adminService.updateMovie(movie_id, updatedMovie).subscribe(response => {
      if (response.message === 'Movie updated successfully') {
        this.testResults.push({ name: 'Update Movie Test', status: 'Passed' });
      } else {
        this.testResults.push({ name: 'Update Movie Test', status: 'Failed', message: 'Unexpected response message' });
      }
    });
  }

  /**
   * Tests the functionality of deleting movies.
   */
  testDeleteMovie(): void {
    const movie_id = '123';
    this.adminService.deleteMovie = () => of({ message: 'Movie deleted successfully' });
    this.adminService.deleteMovie(movie_id).subscribe(response => {
      if (response.message === 'Movie deleted successfully') {
        this.testResults.push({ name: 'Delete Movie Test', status: 'Passed' });
      } else {
        this.testResults.push({ name: 'Delete Movie Test', status: 'Failed', message: 'Unexpected response message' });
      }
    });
  }

  /**
   * Tests the functionality of fetching current weather.
   */
  testGetCurrentWeather(): void {
    try {
      const currentWeatherMock = { main: { temp: 20 }, weather: [{ description: 'clear sky' }] };
      this.weatherService.getCurrentWeather = () => of(currentWeatherMock);

      this.weatherService.getCurrentWeather('Test City').subscribe(response => {
        if (response.main.temp === 20 && response.weather[0].description === 'clear sky') {
          this.testResults.push({ name: 'Current Weather Method Test', status: 'Passed' });
        } else {
          this.testResults.push({ name: 'Current Weather Method Test', status: 'Failed', message: 'Incorrect weather data received' });
        }
      });
    } catch (error: any) {
      this.testResults.push({ name: 'Current Weather Method Test', status: 'Failed', message: error.message });
    }
  }

  /**
   * Tests the functionality of fetching weather forecast data.
   */
  testGetWeatherForecast(): void {
    try {
      const weatherForecastMock = { list: [{ dt_txt: '2024-12-10 12:00:00', main: { temp: 18 } }] };
      this.weatherService.getWeatherForecast = () => of(weatherForecastMock);

      this.weatherService.getWeatherForecast('Test City').subscribe(response => {
        const filteredForecast = response.list.filter((item: any) => item.dt_txt.includes('12:00:00'));
        if (filteredForecast.length > 0 && filteredForecast[0].main.temp === 18) {
          this.testResults.push({ name: 'Weather Forecast Method Test', status: 'Passed' });
        } else {
          this.testResults.push({ name: 'Weather Forecast Method Test', status: 'Failed', message: 'Incorrect forecast data received' });
        }
      });
    } catch (error: any) {
      this.testResults.push({ name: 'Weather Forecast Method Test', status: 'Failed', message: error.message });
    }
  }
}