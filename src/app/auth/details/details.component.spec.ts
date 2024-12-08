import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetailsComponent } from './details.component';
import { MoviesService } from '../../services/movies.service';
import { FavoritesService } from '../../services/favorites.service';
import { WeatherService } from '../../services/weather.service';
import { ActivatedRoute } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

describe('DetailsComponent', () => {
  let component: DetailsComponent;
  let fixture: ComponentFixture<DetailsComponent>;
  let moviesService: MoviesService;
  let favoritesService: FavoritesService;
  let weatherService: WeatherService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [DetailsComponent],
      providers: [
        MoviesService,
        FavoritesService,
        WeatherService,
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => '1',
              },
            },
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsComponent);
    component = fixture.componentInstance;
    moviesService = TestBed.inject(MoviesService);
    favoritesService = TestBed.inject(FavoritesService);
    weatherService = TestBed.inject(WeatherService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch movie details on init', () => {
    const movie = { _id: '1', title: 'Test Movie' };
    spyOn(moviesService, 'getMovieById').and.returnValue(of(movie));
    spyOn(component, 'getWeatherForCity1').and.callThrough();
    spyOn(component, 'getWeatherForCity2').and.callThrough();

    component.ngOnInit();

    expect(moviesService.getMovieById).toHaveBeenCalledWith('1');
    expect(component.movie).toEqual(movie);
    expect(component.getWeatherForCity1).toHaveBeenCalled();
    expect(component.getWeatherForCity2).toHaveBeenCalled();
  });

  it('should check if the movie is in the user\'s favorites', () => {
    const favorites = [{ movie_id: '1', _id: 'fav1' }];
    spyOn(favoritesService, 'getUserFavorites').and.returnValue(of(favorites));

    const movie = { _id: '1' };
    component.movie = movie;
    component.checkIfFavorite();

    expect(component.isFavorite).toBe(true);
  });

  it('should add the movie to the user\'s favorites', () => {
    const movie = { _id: '1' };
    component.movie = movie;
    spyOn(favoritesService, 'addFavorite').and.returnValue(of({}));

    component.addToFavorites();

    expect(component.isFavorite).toBe(true);
  });

  it('should remove the movie from the user\'s favorites', () => {
    const movie = { _id: '1' };
    const favorites = [{ _id: 'fav1', movie_id: '1' }];
    component.movie = movie;
    component.isFavorite = true;
    spyOn(favoritesService, 'getUserFavorites').and.returnValue(of(favorites));
    spyOn(favoritesService, 'deleteFavorite').and.returnValue(of({}));

    component.removeFromFavorites();

    expect(component.isFavorite).toBe(false);
  });

  it('should fetch current weather data for the first city', () => {
    const weatherData = { main: { temp: 20 }, weather: [{ description: 'clear sky' }] };
    spyOn(weatherService, 'getCurrentWeather').and.returnValue(of(weatherData));
    spyOn(weatherService, 'getWeatherForecast').and.returnValue(of({ list: [] }));

    component.getWeatherForCity1();

    expect(component.weatherCity1).toEqual(weatherData);
  });

  it('should fetch current weather data for the second city', () => {
    const weatherData = { main: { temp: 20 }, weather: [{ description: 'clear sky' }] };
    spyOn(weatherService, 'getCurrentWeather').and.returnValue(of(weatherData));
    spyOn(weatherService, 'getWeatherForecast').and.returnValue(of({ list: [] }));

    component.getWeatherForCity2();

    expect(component.weatherCity2).toEqual(weatherData);
  });

  it('should switch city', () => {
    component.switchCity('City2');
    expect(component.currentCity).toBe('City2');
  });

  it('should search for weather data of the entered city', () => {
    const weatherData = { main: { temp: 20 }, weather: [{ description: 'clear sky' }] };
    const forecastData = { list: [] };
    spyOn(weatherService, 'getCurrentWeather').and.returnValue(of(weatherData));
    spyOn(weatherService, 'getWeatherForecast').and.returnValue(of(forecastData));

    component.searchCity = 'London';
    component.searchWeather();

    expect(component.searchedWeather).toEqual(weatherData);
    expect(component.searchedForecast).toEqual(forecastData.list);
  });
});