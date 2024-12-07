import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * Service for fetching weather data from OpenWeatherMap API.
 * @since v1.0.0
 */
@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  /**
   * API key for OpenWeatherMap API.
   * @since v1.0.0
   * @access private
   * @type {string}
   */
  private apiKey: string = '0a070c9fb8d18888f29ef9bdefaf7737';

  /**
   * URL for fetching current weather data.
   * @since v1.0.0
   * @access private
   * @type {string}
   */
  private currentWeatherApiUrl: string = 'https://api.openweathermap.org/data/2.5/weather';

  /**
   * URL for fetching 5-day weather forecast data.
   * @since v1.0.0
   * @access private
   * @type {string}
   */
  private forecastApiUrl: string = 'https://api.openweathermap.org/data/2.5/forecast';

  /**
   * @constructor
   * @param {HttpClient} http - The HTTP client used for making API calls.
   */
  constructor(private http: HttpClient) { }

  /**
   * Fetches the current weather data for a specified city.
   * @since v1.0.0
   * @param {string} city - The name of the city for which to fetch weather data.
   * @param {string} [units='metric'] - The units of measurement for the weather data (default: metric).
   * @returns {Observable<any>} An observable containing the current weather data.
   */
  getCurrentWeather(city: string, units: string = 'metric'): Observable<any> {
    const url = `${this.currentWeatherApiUrl}?q=${city}&appid=${this.apiKey}&units=${units}`;
    return this.http.get<any>(url);
  }

  /**
   * Fetches the 5-day weather forecast data for a specified city.
   * @since v1.0.0
   * @param {string} city - The name of the city for which to fetch weather forecast data.
   * @param {string} [units='metric'] - The units of measurement for the weather forecast data (default: metric).
   * @returns {Observable<any>} An observable containing the weather forecast data.
   */
  getWeatherForecast(city: string, units: string = 'metric'): Observable<any> {
    const url = `${this.forecastApiUrl}?q=${city}&appid=${this.apiKey}&units=${units}`;
    return this.http.get<any>(url);
  }
}