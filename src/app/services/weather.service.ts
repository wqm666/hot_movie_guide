import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * Service for fetching weather data from OpenWeatherMap API.
 * This service provides methods to retrieve current weather and 5-day forecast data
 * for a specified city using the OpenWeatherMap API.
 * @since v1.0.0
 * @author Zirun Wang
 */
@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  /**
   * API key for OpenWeatherMap API.
   * This key is used to authenticate requests to the OpenWeatherMap API.
   * @private
   * @type {string}
   */
  private apiKey: string = '0a070c9fb8d18888f29ef9bdefaf7737';

  /**
   * URL for fetching current weather data.
   * This URL is used to fetch the current weather data for a specified city.
   * @private
   * @type {string}
   */
  private currentWeatherApiUrl: string = 'https://api.openweathermap.org/data/2.5/weather';

  /**
   * URL for fetching 5-day weather forecast data.
   * This URL is used to fetch the 5-day weather forecast data for a specified city.
   * @private
   * @type {string}
   */
  private forecastApiUrl: string = 'https://api.openweathermap.org/data/2.5/forecast';

  /**
   * @constructor
   * @param {HttpClient} http - The HTTP client used for making requests to the OpenWeatherMap API.
   * The `HttpClient` service is injected to handle the API calls for retrieving weather data.
   */
  constructor(private http: HttpClient) { }

  /**
   * Fetches the current weather data for a specified city.
   * This method retrieves the current weather conditions, including temperature, humidity, weather description, etc.
   * @since v1.0.0
   * @param {string} city - The name of the city for which to fetch weather data.
   * @param {string} [units='metric'] - The units of measurement for the weather data (default: 'metric' for Celsius).
   * @returns {Observable<any>} - An observable containing the current weather data for the specified city.
   * The returned data includes properties such as temperature, weather conditions, humidity, and more.
   */
  getCurrentWeather(city: string, units: string = 'metric'): Observable<any> {
    const url = `${this.currentWeatherApiUrl}?q=${city}&appid=${this.apiKey}&units=${units}`;
    return this.http.get<any>(url);
  }

  /**
   * Fetches the 5-day weather forecast data for a specified city.
   * This method retrieves forecast data for the next 5 days, with forecasts at regular intervals (every 3 hours).
   * @since v1.0.0
   * @param {string} city - The name of the city for which to fetch weather forecast data.
   * @param {string} [units='metric'] - The units of measurement for the weather forecast data (default: 'metric' for Celsius).
   * @returns {Observable<any>} - An observable containing the 5-day weather forecast data for the specified city.
   * The returned data includes forecast information at 3-hour intervals for 5 days.
   */
  getWeatherForecast(city: string, units: string = 'metric'): Observable<any> {
    const url = `${this.forecastApiUrl}?q=${city}&appid=${this.apiKey}&units=${units}`;
    return this.http.get<any>(url);
  }
}