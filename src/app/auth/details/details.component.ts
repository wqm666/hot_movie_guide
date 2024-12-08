import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MoviesService } from '../../services/movies.service';
import { FavoritesService } from '../../services/favorites.service';
import { WeatherService } from '../../services/weather.service';

/**
 * Interface for video details.
 * Describes the properties of a video object.
 * @since v1.0.0
 */
interface Video {
  /**
   * The type of the video (e.g., trailer, teaser, etc.).
   */
  kind: string;

  /**
   * The language of the video.
   */
  language: string;

  /**
   * The source or platform where the video is hosted.
   */
  source: string;

  /**
   * The URL of the video.
   */
  url: string;
}

/**
 * Component for displaying movie details.
 * Handles fetching movie details, managing favorites, and integrating weather data for added context.
 * @since v1.0.0
 * @author Zirun Wang
 */
@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {
  /**
   * The details of the movie.
   * Contains information about the movie like title, release date, etc.
   */
  movie: any;

  /**
   * Indicates whether the movie is a favorite.
   * This value is set to `true` if the movie is added to the user's favorites, otherwise `false`.
   */
  isFavorite: boolean = false;

  /**
   * The weather data for the first city (New York).
   * Contains current weather information (e.g., temperature, humidity, weather conditions).
   */
  weatherCity1: any;

  /**
   * The weather data for the second city (Los Angeles).
   * Contains current weather information (e.g., temperature, humidity, weather conditions).
   */
  weatherCity2: any;

  /**
   * The forecast data for the first city (New York).
   * Contains forecast data filtered for noon (12:00:00) from the weather API.
   */
  forecastCity1: any;

  /**
   * The forecast data for the second city (Los Angeles).
   * Contains forecast data filtered for noon (12:00:00) from the weather API.
   */
  forecastCity2: any;

  /**
   * The currently selected city for displaying weather.
   * This value switches between "City1" (New York) and "City2" (Los Angeles) or any user-selected city.
   */
  currentCity: string = 'City1';

  /**
   * The city name entered by the user for searching weather.
   * This property is used to store the city that the user searches for when looking up the weather.
   */
  searchCity: string = '';

  /**
   * The weather data for the searched city.
   * This property is populated when the user searches for a city and its weather data is fetched.
   */
  searchedWeather: any;

  /**
   * The forecast data for the searched city.
   * Contains forecast data filtered for noon (12:00:00) from the weather API.
   */
  searchedForecast: any;

  /**
   * @constructor
   * @param { ActivatedRoute } route - The activated route service used for accessing route parameters.
   * @param { MoviesService } moviesService - The service used for fetching movie details.
   * @param { FavoritesService } favoritesService - The service used for managing favorite movies.
   * @param { WeatherService } weatherService - The service used for fetching weather details.
   */
  constructor(
    private route: ActivatedRoute,
    private moviesService: MoviesService,
    private favoritesService: FavoritesService,
    private weatherService: WeatherService,
  ) {}

  /**
   * Lifecycle hook that is called after data-bound properties are initialized.
   * Fetches movie details on component initialization.
   * @since v1.0.0
   */
  ngOnInit(): void {
    this.getMovieDetails();
  }

  /**
   * Fetches the details of the movie based on the route parameter.
   * The movie details are fetched from the `MoviesService` using the movie ID from the route.
   * @since v1.0.0
   */
  getMovieDetails(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.moviesService.getMovieById(id).subscribe((movie: any) => {
        this.movie = movie;
        this.checkIfFavorite();
        this.getWeatherForCity1();
        this.getWeatherForCity2();
      }, error => {
        console.error('Error fetching movie details:', error);
      });
    }
  }

  /**
   * Checks if the movie is in the user's favorites.
   * This method checks the current user's favorites using the `FavoritesService`.
   * If the movie exists in the list of favorites, `isFavorite` is set to `true`, otherwise it remains `false`.
   * @since v1.0.0
   */
  checkIfFavorite(): void {
    this.favoritesService.getUserFavorites().subscribe((favorites: any[]) => {
      this.isFavorite = favorites.some(favorite => favorite.movie_id === this.movie._id);
    }, error => {
      console.error('Error fetching favorites:', error);
    });
  }

  /**
   * Adds the movie to the user's favorites.
   * This method calls the `FavoritesService` to add the movie's ID to the list of favorites.
   * After successfully adding, it updates the `isFavorite` property to `true`.
   * @since v1.0.0
   */
  addToFavorites(): void {
    if (this.movie) {
      this.favoritesService.addFavorite(this.movie._id).subscribe(() => {
        this.isFavorite = true;
      }, error => {
        console.error('Error adding to favorites:', error);
      });
    }
  }

  /**
   * Removes the movie from the user's favorites.
   * This method calls the `FavoritesService` to remove the movie from the user's favorites list.
   * After successfully removing, it updates the `isFavorite` property to `false`.
   * @since v1.0.0
   */
  removeFromFavorites(): void {
    if (this.movie) {
      this.favoritesService.getUserFavorites().subscribe((favorites: any[]) => {
        const favorite = favorites.find(fav => fav.movie_id === this.movie._id);
        if (favorite) {
          this.favoritesService.deleteFavorite(favorite._id).subscribe(() => {
            this.isFavorite = false;
          }, error => {
            console.error('Error removing from favorites:', error);
          });
        }
      }, error => {
        console.error('Error fetching favorites:', error);
      });
    }
  }

  /**
   * Fetches the current weather data for the first city (New York).
   * This method uses the `WeatherService` to fetch current weather data and forecast for the city.
   * @since v1.0.0
   */
  getWeatherForCity1(): void {
    const city = 'New York';
    this.weatherService.getCurrentWeather(city).subscribe(data => {
      this.weatherCity1 = data;
    });
    this.weatherService.getWeatherForecast(city).subscribe(data => {
      this.forecastCity1 = data.list.filter((item: any) => item.dt_txt.includes('12:00:00'));
    });
  }

  /**
   * Fetches the current weather data for the second city (Los Angeles).
   * This method uses the `WeatherService` to fetch current weather data and forecast for the city.
   * @since v1.0.0
   */
  getWeatherForCity2(): void {
    const city = 'Los Angeles';
    this.weatherService.getCurrentWeather(city).subscribe(data => {
      this.weatherCity2 = data;
    });
    this.weatherService.getWeatherForecast(city).subscribe(data => {
      this.forecastCity2 = data.list.filter((item: any) => item.dt_txt.includes('12:00:00'));
    });
  }

  /**
   * Switches the weather display to the selected city.
   * This method updates the `currentCity` to the selected city, which triggers the UI to display the weather for that city.
   * @since v1.0.0
   * @param { string } city - The city to switch to.
   */
  switchCity(city: string): void {
    this.currentCity = city;
  }

  /**
   * Searches for weather data of the entered city.
   * This method uses the `WeatherService` to fetch weather data and forecast for the city entered by the user.
   * @since v1.0.0
   */
  searchWeather(): void {
    this.weatherService.getCurrentWeather(this.searchCity).subscribe(data => {
      this.searchedWeather = data;
    }, error => {
      console.error('Error fetching searched weather data:', error);
      alert('Fetching searched weather data failed');
    });

    this.weatherService.getWeatherForecast(this.searchCity).subscribe(data => {
      this.searchedForecast = data.list.filter((item: any) => item.dt_txt.includes('12:00:00'));
    }, error => {
      console.error('Error fetching searched weather forecast:', error);
      alert('Fetching searched weather data failed');
    });
  }
}