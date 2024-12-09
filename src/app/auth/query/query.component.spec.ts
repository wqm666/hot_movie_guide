import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QueryComponent } from './query.component';
import { MoviesService } from '../../services/movies.service';
import { FavoritesService } from '../../services/favorites.service';
import { AuthService } from '../../services/auth.service';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of } from 'rxjs';

describe('QueryComponent', () => {
  let component: QueryComponent;
  let fixture: ComponentFixture<QueryComponent>;
  let moviesService: MoviesService;
  let favoritesService: FavoritesService;
  let authService: AuthService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule, FormsModule],
      declarations: [QueryComponent],
      providers: [MoviesService, FavoritesService, AuthService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QueryComponent);
    component = fixture.componentInstance;
    moviesService = TestBed.inject(MoviesService);
    favoritesService = TestBed.inject(FavoritesService);
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch user info on init', () => {
    const userInfo = { username: 'testuser', is_admin: false };
    spyOn(authService, 'getUserInfo').and.returnValue(of(userInfo));

    component.ngOnInit();

    expect(authService.getUserInfo).toHaveBeenCalled();
    expect(component.userInfo).toEqual(userInfo);
    expect(component.is_admin).toBe(false);
  });

  it('should fetch user favorites on init', () => {
    const favorites = [{ movie_id: '1', _id: 'fav1' }];
    spyOn(favoritesService, 'getUserFavorites').and.returnValue(of(favorites));

    component.ngOnInit();

    expect(favoritesService.getUserFavorites).toHaveBeenCalled();
    expect(component.favorites).toEqual(favorites);
  });

  it('should load movies', () => {
    const movies = [{ _id: '1', title: 'Test Movie' }];
    spyOn(moviesService, 'getAllMovies').and.returnValue(of(movies));

    component.loadMovies();

    expect(moviesService.getAllMovies).toHaveBeenCalled();
    expect(component.movies).toEqual(movies);
  });

  it('should update movie favorite status', () => {
    const movies = [{ _id: '1', title: 'Test Movie' }];
    const favorites = [{ movie_id: '1', _id: 'fav1' }];
    component.movies = movies;
    component.favorites = favorites;

    component.updateMovieFavoriteStatus();

    expect(component.movies[0].isFavorite).toBe(true);
    expect(component.movies[0].favorite_id).toBe('fav1');
  });

  it('should filter movies', () => {
    const criteria = { language: 'en' };
    const filteredMovies = [{ _id: '1', title: 'Filtered Movie' }];
    spyOn(moviesService, 'filterMovies').and.returnValue(of(filteredMovies));

    component.filterLanguage = 'en';
    component.filterMovies();

    expect(moviesService.filterMovies).toHaveBeenCalledWith(criteria);
    expect(component.movies).toEqual(filteredMovies);
  });

  it('should sort movies', () => {
    const criteria = { release_date: 1 };
    const sortedMovies = [{ _id: '1', title: 'Sorted Movie' }];
    spyOn(moviesService, 'sortMovies').and.returnValue(of(sortedMovies));

    component.sortField = 'release_date';
    component.sortOrder = 1;
    component.sortMovies();

    expect(moviesService.sortMovies).toHaveBeenCalledWith(criteria);
    expect(component.movies).toEqual(sortedMovies);
  });

  it('should aggregate movies', () => {
    const criteria = [{ $group: { _id: "$language", total_movies: { $sum: 1 }, average_duration: { $avg: "$duration" } } }];
    const aggregationResults = [{ _id: 'en', total_movies: 10, average_duration: 120 }];
    spyOn(moviesService, 'aggregateMovies').and.returnValue(of(aggregationResults));

    component.aggregateMovies();

    expect(moviesService.aggregateMovies).toHaveBeenCalledWith(criteria);
    expect(component.totalMovies).toBe(10);
    expect(component.totalAverageDuration).toBe(120);
    expect(component.languageStats).toEqual(aggregationResults);
  });

  it('should navigate to the next page', () => {
    component.totalPages = 2;
    component.currentPage = 1;
    component.nextPage();

    expect(component.currentPage).toBe(2);
  });

  it('should navigate to the previous page', () => {
    component.totalPages = 2;
    component.currentPage = 2;
    component.previousPage();

    expect(component.currentPage).toBe(1);
  });

  it('should jump to a specific page', () => {
    component.totalPages = 3;
    component.gotoPageNumber = 2;
    component.jumpToPage();

    expect(component.currentPage).toBe(2);
  });

  it('should handle invalid page number input', () => {
    spyOn(window, 'alert');
    component.totalPages = 3;
    component.gotoPageNumber = 4;
    component.jumpToPage();

    expect(component.currentPage).toBe(1);
    expect(window.alert).toHaveBeenCalledWith('Invalid page number');
  });

  it('should add a movie to favorites', () => {
    const movieId = '1';
    spyOn(favoritesService, 'addFavorite').and.returnValue(of({}));
    spyOn(component, 'getUserFavorites');

    component.addToFavorites(movieId);

    expect(favoritesService.addFavorite).toHaveBeenCalledWith(movieId);
    expect(component.getUserFavorites).toHaveBeenCalled();
  });

  it('should remove a movie from favorites', () => {
    const favoriteId = 'fav1';
    spyOn(favoritesService, 'deleteFavorite').and.returnValue(of({}));
    spyOn(component, 'getUserFavorites');

    component.removeFromFavorites(favoriteId);

    expect(favoritesService.deleteFavorite).toHaveBeenCalledWith(favoriteId);
    expect(component.getUserFavorites).toHaveBeenCalled();
  });

  it('should logout the user', () => {
    spyOn(authService, 'logout').and.returnValue(of({}));
    spyOn(router, 'navigate');

    component.logout();

    expect(authService.logout).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should retrieve poster URL', () => {
    const movie = { images: [{ type: 'Poster', url: 'poster_url' }] };
    expect(component.getPosterUrl(movie)).toBe('poster_url');
  });

  it('should return default poster URL if not found', () => {
    const movie = { images: [{ type: 'Backdrop', url: 'backdrop_url' }] };
    expect(component.getPosterUrl(movie)).toBe('../../../assets/logo.jpg');
  });
});