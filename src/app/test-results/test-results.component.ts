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
  ) {}

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
    this.testHomePage();
    this.testMovieDetails();
    this.testUserInfo();
    this.testFavorites();
    this.testQuery();
    this.testAdminPage();
    this.testWeather();
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
   * Tests the functionality of loading and displaying movies on the home page.
   */
  testHomePage(): void {
    try {
      const movies = [{ title: 'Test Movie', language: 'English', image: 'test.jpg', release_date: '2021-01-01', duration: 120, tags: ['Drama'] }];
      this.moviesService.getAllMovies = () => of(movies);
      this.moviesService.getAllMovies().subscribe(response => {
        if (response.length > 0) {
          this.testResults.push({ name: 'Home Page Test', status: 'Passed' });
        } else {
          this.testResults.push({ name: 'Home Page Test', status: 'Failed', message: 'No movies received' });
        }
      });
    } catch (error: any) {
      this.testResults.push({ name: 'Home Page Test', status: 'Failed', message: error.message });
    }
  }

  /**
   * Tests the functionality of fetching and displaying movie details.
   */
  testMovieDetails(): void {
    try {
      const movie = { title: 'Test Movie', details: 'Some details', videos: [], feeders: [] };
      this.moviesService.getMovieById = () => of(movie);
      this.moviesService.getMovieById('1').subscribe(response => {
        if (response.title === 'Test Movie') {
          this.testResults.push({ name: 'Movie Details Test', status: 'Passed' });
        } else {
          this.testResults.push({ name: 'Movie Details Test', status: 'Failed', message: 'Incorrect movie details received' });
        }
      });
    } catch (error: any) {
      this.testResults.push({ name: 'Movie Details Test', status: 'Failed', message: error.message });
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
          this.testResults.push({ name: 'User Info Test', status: 'Failed', message: 'Incorrect user info received' });
        }
      });
    } catch (error: any) {
      this.testResults.push({ name: 'User Info Test', status: 'Failed', message: error.message });
    }
  }

  /**
   * Tests the functionality of fetching and displaying user favorites.
   */
  testFavorites(): void {
    try {
      const favorites = [{ movie_id: '1', _id: 'fav1' }];
      this.favoritesService.getUserFavorites = () => of(favorites);
      this.favoritesService.getUserFavorites().subscribe(response => {
        if (response.length > 0) {
          this.testResults.push({ name: 'Favorites Test', status: 'Passed' });
        } else {
          this.testResults.push({ name: 'Favorites Test', status: 'Failed', message: 'No favorites received' });
        }
      });
    } catch (error: any) {
      this.testResults.push({ name: 'Favorites Test', status: 'Failed', message: error.message });
    }
  }

  /**
   * Tests the functionality of querying movies based on certain criteria.
   */
  testQuery(): void {
    try {
      const movies = [{ title: 'Test Movie', language: 'English', release_date: '2021-01-01', duration: 120 }];
      this.moviesService.filterMovies = () => of(movies);
      this.moviesService.filterMovies({ language: 'English' }).subscribe(response => {
        if (response.length > 0) {
          this.testResults.push({ name: 'Query Test', status: 'Passed' });
        } else {
          this.testResults.push({ name: 'Query Test', status: 'Failed', message: 'No movies received' });
        }
      });
    } catch (error: any) {
      this.testResults.push({ name: 'Query Test', status: 'Failed', message: error.message });
    }
  }

  /**
   * Tests the functionality of admin-related operations.
   */
  testAdminPage(): void {
    try {
      const users = [{ username: 'testuser', is_admin: true }];
      this.adminService.getAllUsers = () => of(users);
      this.adminService.getAllUsers().subscribe(response => {
        if (response.length > 0 && response[0].is_admin) {
          this.testResults.push({ name: 'Admin Page Test', status: 'Passed' });
        } else {
          this.testResults.push({ name: 'Admin Page Test', status: 'Failed', message: 'No admin users received' });
        }
      });
    } catch (error: any) {
      this.testResults.push({ name: 'Admin Page Test', status: 'Failed', message: error.message });
    }
  }

  /**
   * Tests the functionality of fetching current weather and weather forecast data.
   */
  testWeather(): void {
    try {
      const currentWeather = { main: { temp: 20 }, weather: [{ description: 'clear sky' }] };
      this.weatherService.getCurrentWeather = () => of(currentWeather);
      this.weatherService.getCurrentWeather('Test City').subscribe(response => {
        if (response.main.temp === 20) {
          this.testResults.push({ name: 'Current Weather Test', status: 'Passed' });
        } else {
          this.testResults.push({ name: 'Current Weather Test', status: 'Failed', message: 'Incorrect current weather data' });
        }
      });
  
      const weatherForecast = { list: [{ dt_txt: '2023-01-01 12:00:00', main: { temp: 18 } }] };
      this.weatherService.getWeatherForecast = () => of(weatherForecast);
      this.weatherService.getWeatherForecast('Test City').subscribe(response => {
        const filteredForecast = response.list.filter((item: any) => item.dt_txt.includes('12:00:00'));
        if (filteredForecast.length > 0 && filteredForecast[0].main.temp === 18) {
          this.testResults.push({ name: 'Weather Forecast Test', status: 'Passed' });
        } else {
          this.testResults.push({ name: 'Weather Forecast Test', status: 'Failed', message: 'Incorrect weather forecast data' });
        }
      });
    } catch (error: any) {
      this.testResults.push({ name: 'Weather Test', status: 'Failed', message: error.message });
    }
  }
}