import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MoviesService } from '../../services/movies.service';
import { FavoritesService } from '../../services/favorites.service';
import { WeatherService } from '../../services/weather.service';

/**
 * Interface for video details.
 * @since v1.0.0
 */
interface Video {
  kind: string;
  language: string;
  source: string;
  url: string;
}

/**
 * Component for displaying movie details.
 * Handles fetching movie details and managing favorites.
 * @since v1.0.0
 * @autor Zirun Wang
 */
@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {
  /**
   * The details of the movie.
   */
  movie: any;

  /**
   * Indicates whether the movie is a favorite.
   */
  isFavorite: boolean = false;

  /**
   * The weather data for the first city.
   */
  weatherCity1: any;

  /**
   * The weather data for the second city.
   */
  weatherCity2: any;

  /**
   * The forecast data for the first city.
   */
  forecastCity1: any;

  /**
   * The forecast data for the second city.
   */
  forecastCity2: any;

  /**
   * The currently selected city for displaying weather.
   */
  currentCity: string = 'City1';

  /**
   * The city name entered by the user for searching weather.
   */
  searchCity: string = '';

  /**
   * The weather data for the searched city.
   */
  searchedWeather: any;

  /**
   * The forecast data for the searched city.
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
   * Fetches the current weather data for the first city.
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
   * Fetches the current weather data for the second city.
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
   * @since v1.0.0
   * @param { string } city - The city to switch to.
   */
  switchCity(city: string): void {
    this.currentCity = city;
  }

  /**
   * Searches for weather data of the entered city.
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