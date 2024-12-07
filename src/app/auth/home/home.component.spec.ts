import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { MoviesService } from '../../services/movies.service';
import { FavoritesService } from '../../services/favorites.service';
import { AuthService } from '../../services/auth.service';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of } from 'rxjs';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let moviesService: MoviesService;
  let favoritesService: FavoritesService;
  let authService: AuthService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule, FormsModule],
      declarations: [HomeComponent],
      providers: [MoviesService, FavoritesService, AuthService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
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

  it('should load movies and favorites on init', () => {
    const movies = [{ _id: '1', title: 'Test Movie' }];
    const favorites = [{ movie_id: '1', _id: 'fav1' }];
    spyOn(moviesService, 'getAllMovies').and.returnValue(of(movies));
    spyOn(favoritesService, 'getUserFavorites').and.returnValue(of(favorites));
    spyOn(component, 'updateMoviesWithFavorites');

    component.ngOnInit();

    expect(moviesService.getAllMovies).toHaveBeenCalled();
    expect(favoritesService.getUserFavorites).toHaveBeenCalled();
    expect(component.movies).toEqual(movies);
    expect(component.favorites).toEqual(favorites);
    expect(component.updateMoviesWithFavorites).toHaveBeenCalled();
  });

  it('should fetch user info on init', () => {
    const userInfo = { username: 'testuser', is_admin: false };
    spyOn(authService, 'getUserInfo').and.returnValue(of(userInfo));

    component.ngOnInit();

    expect(authService.getUserInfo).toHaveBeenCalled();
    expect(component.userInfo).toEqual(userInfo);
    expect(component.is_admin).toBe(false);
  });

  it('should update movies with favorite status', () => {
    const movies = [{ _id: '1', title: 'Test Movie' }];
    const favorites = [{ movie_id: '1', _id: 'fav1' }];
    component.movies = movies;
    component.favorites = favorites;

    component.updateMoviesWithFavorites();

    expect(component.movies[0].isFavorite).toBe(true);
    expect(component.movies[0].favorite_id).toBe('fav1');
  });

  it('should add a movie to favorites', () => {
    const movieId = '1';
    const favorite = { movie_id: movieId, _id: 'fav1' };
    spyOn(favoritesService, 'addFavorite').and.returnValue(of(favorite));
    spyOn(component, 'loadMoviesAndFavorites');

    component.addToFavorites(movieId);

    expect(favoritesService.addFavorite).toHaveBeenCalledWith(movieId);
    expect(component.loadMoviesAndFavorites).toHaveBeenCalled();
  });

  it('should remove a movie from favorites', () => {
    const favoriteId = 'fav1';
    component.movies = [{ _id: '1', favorite_id: favoriteId, isFavorite: true }];
    spyOn(favoritesService, 'deleteFavorite').and.returnValue(of({}));

    component.removeFromFavorites(favoriteId);

    expect(favoritesService.deleteFavorite).toHaveBeenCalledWith(favoriteId);
    expect(component.movies[0].isFavorite).toBe(false);
    expect(component.movies[0].favorite_id).toBe(null);
  });

  it('should logout the user', () => {
    spyOn(authService, 'logout').and.returnValue(of({}));
    spyOn(router, 'navigate');

    component.logout();

    expect(authService.logout).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should update pagination and return current movies', () => {
    component.movies = Array.from({ length: 24 }, (_, i) => ({ _id: i.toString() }));
    component.setCurrentPage(1);

    expect(component.currentMovies.length).toBe(12);
    component.nextPage();
    expect(component.currentPage).toBe(2);
    expect(component.currentMovies.length).toBe(12);
    component.previousPage();
    expect(component.currentPage).toBe(1);
    component.gotoPageNumber = 2;
    component.jumpToPage();
    expect(component.currentPage).toBe(2);
  });

  it('should navigate to the next page', () => {
    component.movies = Array.from({ length: 24 }, (_, i) => ({ _id: i.toString() }));
    component.setCurrentPage(1);
    component.nextPage();

    expect(component.currentPage).toBe(2);
    expect(component.currentMovies.length).toBe(12);
  });

  it('should navigate to the previous page', () => {
    component.movies = Array.from({ length: 24 }, (_, i) => ({ _id: i.toString() }));
    component.setCurrentPage(2);
    component.previousPage();

    expect(component.currentPage).toBe(1);
    expect(component.currentMovies.length).toBe(12);
  });

  it('should jump to a specific page', () => {
    component.movies = Array.from({ length: 24 }, (_, i) => ({ _id: i.toString() }));
    component.setCurrentPage(1);
    component.gotoPageNumber = 2;
    component.jumpToPage();

    expect(component.currentPage).toBe(2);
    expect(component.currentMovies.length).toBe(12);
  });
});