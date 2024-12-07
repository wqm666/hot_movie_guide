import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FavoritesComponent } from './favorites.component';
import { MoviesService } from '../../services/movies.service';
import { FavoritesService } from '../../services/favorites.service';
import { AuthService } from '../../services/auth.service';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms'; // 导入 FormsModule
import { Router } from '@angular/router';
import { of } from 'rxjs';

describe('FavoritesComponent', () => {
  let component: FavoritesComponent;
  let fixture: ComponentFixture<FavoritesComponent>;
  let moviesService: MoviesService;
  let favoritesService: FavoritesService;
  let authService: AuthService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule, FormsModule],
      declarations: [FavoritesComponent],
      providers: [MoviesService, FavoritesService, AuthService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FavoritesComponent);
    component = fixture.componentInstance;
    moviesService = TestBed.inject(MoviesService);
    favoritesService = TestBed.inject(FavoritesService);
    authService = TestBed.inject(AuthService);
    router = fixture.debugElement.injector.get(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch user info on init', () => {
    const userInfo = { username: 'testuser', is_admin: false };
    spyOn(authService, 'getUserInfo').and.returnValue(of(userInfo));

    component.getUserInfo();

    expect(component.userInfo).toEqual(userInfo);
    expect(component.is_admin).toBe(false);
  });

  it('should fetch user favorites on init', () => {
    const favorites = [{ movie_id: '1', _id: 'fav1' }];
    spyOn(favoritesService, 'getUserFavorites').and.returnValue(of(favorites));

    component.getUserFavorites();

    expect(component.favorites).toEqual(favorites);
  });

  it('should load favorite movies', () => {
    const favorites = [{ movie_id: '1', _id: 'fav1' }];
    const movie = { _id: '1', title: 'Test Movie', images: [] };
    spyOn(favoritesService, 'getUserFavorites').and.returnValue(of(favorites));
    spyOn(moviesService, 'getMovieById').and.returnValue(of(movie));

    component.getUserFavorites();
    component.loadFavoriteMovies();

    expect(component.movies.length).toBe(1);
    expect(component.movies[0].title).toBe('Test Movie');
  });

  it('should add a movie to favorites', () => {
    const movieId = '1';
    const favorite = { movie_id: movieId, _id: 'fav1' };
    spyOn(favoritesService, 'addFavorite').and.returnValue(of(favorite));
    spyOn(component, 'loadFavoriteMovies');

    component.addToFavorites(movieId);

    expect(favoritesService.addFavorite).toHaveBeenCalledWith(movieId);
    expect(component.loadFavoriteMovies).toHaveBeenCalled();
  });

  it('should remove a movie from favorites', () => {
    const favoriteId = 'fav1';
    component.movies = [{ _id: '1', favorite_id: favoriteId }];
    spyOn(favoritesService, 'deleteFavorite').and.returnValue(of({}));

    component.removeFromFavorites(favoriteId);

    expect(favoritesService.deleteFavorite).toHaveBeenCalledWith(favoriteId);
    expect(component.movies.length).toBe(0);
  });

  it('should logout the user', () => {
    spyOn(authService, 'logout').and.returnValue(of({}));
    spyOn(router, 'navigate');

    component.logout();

    expect(authService.logout).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should update pagination', () => {
    component.movies = Array.from({ length: 24 }, (_, i) => ({ _id: i.toString() }));
    component.updatePagination();

    expect(component.totalPages).toBe(2);
    expect(component.currentMovies.length).toBe(12);
  });

  it('should navigate to the next page', () => {
    component.movies = Array.from({ length: 24 }, (_, i) => ({ _id: i.toString() }));
    component.updatePagination();
    component.nextPage();

    expect(component.currentPage).toBe(2);
    expect(component.currentMovies.length).toBe(12);
  });

  it('should navigate to the previous page', () => {
    component.movies = Array.from({ length: 24 }, (_, i) => ({ _id: i.toString() }));
    component.updatePagination();
    component.nextPage();
    component.previousPage();

    expect(component.currentPage).toBe(1);
    expect(component.currentMovies.length).toBe(12);
  });

  it('should jump to a specific page', () => {
    component.movies = Array.from({ length: 24 }, (_, i) => ({ _id: i.toString() }));
    component.updatePagination();
    component.gotoPageNumber = 2;
    component.jumpToPage();

    expect(component.currentPage).toBe(2);
    expect(component.currentMovies.length).toBe(12);
  });
});