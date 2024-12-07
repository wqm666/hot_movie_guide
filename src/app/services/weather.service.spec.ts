import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { WeatherService } from './weather.service';

describe('WeatherService', () => {
  let service: WeatherService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [WeatherService]
    });
    service = TestBed.inject(WeatherService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch current weather data', () => {
    const dummyWeather = {
      main: { temp: 15, humidity: 82 },
      weather: [{ description: 'clear sky', icon: '01d' }],
      wind: { speed: 3.1 }
    };

    service.getCurrentWeather('London').subscribe(weather => {
      expect(weather.main.temp).toBe(15);
      expect(weather.weather[0].description).toBe('clear sky');
      expect(weather.main.humidity).toBe(82);
    });

    const req = httpMock.expectOne(`${service['currentWeatherApiUrl']}?q=London&appid=${service['apiKey']}&units=metric`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyWeather);
  });

  it('should fetch weather forecast data', () => {
    const dummyForecast = {
      list: [
        { dt_txt: '2023-01-01 12:00:00', main: { temp: 15 }, weather: [{ description: 'clear sky', icon: '01d' }] },
        { dt_txt: '2023-01-02 12:00:00', main: { temp: 17 }, weather: [{ description: 'few clouds', icon: '02d' }] }
      ]
    };

    service.getWeatherForecast('London').subscribe(forecast => {
      expect(forecast.list.length).toBe(2);
      expect(forecast.list[0].main.temp).toBe(15);
      expect(forecast.list[1].main.temp).toBe(17);
    });

    const req = httpMock.expectOne(`${service['forecastApiUrl']}?q=London&appid=${service['apiKey']}&units=metric`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyForecast);
  });
});