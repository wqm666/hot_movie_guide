import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ManageComponent } from './manage.component';
import { MoviesService } from '../../services/movies.service';
import { AdminService } from '../../services/admin.service';
import { AuthService } from '../../services/auth.service';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';

describe('ManageComponent', () => {
  let component: ManageComponent;
  let fixture: ComponentFixture<ManageComponent>;
  let moviesService: MoviesService;
  let adminService: AdminService;
  let authService: AuthService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule, FormsModule],
      declarations: [ManageComponent],
      providers: [MoviesService, AdminService, AuthService]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageComponent);
    component = fixture.componentInstance;
    moviesService = TestBed.inject(MoviesService);
    adminService = TestBed.inject(AdminService);
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch user info on init', () => {
    const userInfo = { username: 'admin', is_admin: true };
    spyOn(authService, 'getUserInfo').and.returnValue(of(userInfo));

    component.ngOnInit();

    expect(authService.getUserInfo).toHaveBeenCalled();
    expect(component.userInfo).toEqual(userInfo);
    expect(component.is_admin).toBe(true);
  });

  it('should load movies on init', () => {
    const movies = [{ _id: '1', title: 'Test Movie' }];
    spyOn(moviesService, 'getAllMovies').and.returnValue(of(movies));

    component.ngOnInit();

    expect(moviesService.getAllMovies).toHaveBeenCalled();
    expect(component.movies).toEqual(movies);
  });

  it('should fetch all users on init', () => {
    const users = [{ _id: '1', username: 'testuser', is_admin: false }];
    spyOn(adminService, 'getAllUsers').and.returnValue(of(users));

    component.ngOnInit();

    expect(adminService.getAllUsers).toHaveBeenCalled();
    expect(component.users).toEqual(users);
  });

  it('should toggle admin status', () => {
    const userId = '1';
    spyOn(adminService, 'toggleAdmin').and.returnValue(of({}));
    spyOn(window, 'alert');
    spyOn(component, 'getAllUsers');

    component.toggleAdmin(userId);

    expect(adminService.toggleAdmin).toHaveBeenCalledWith(userId);
    expect(window.alert).toHaveBeenCalledWith('User admin status toggled');
    expect(component.getAllUsers).toHaveBeenCalled();
  });

  it('should show add movie form', () => {
    component.showAddMovieFormToggle();

    expect(component.showAddMovieForm).toBe(true);
    expect(component.newMovie).toBeDefined();
  });

  it('should add a movie', () => {
    component.showAddMovieFormToggle();
    spyOn(adminService, 'addMovie').and.returnValue(of({}));
    spyOn(window, 'alert');
    spyOn(component, 'loadMovies');
    
    component.addMovie();

    expect(adminService.addMovie).toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith('Movie added successfully');
    expect(component.loadMovies).toHaveBeenCalled();
  });

  it('should edit a movie', () => {
    const movieId = '1';
    const movie = { _id: '1', title: 'Test Movie', tags: '[]', details: '[]', videos: '[]', feeders: '[]', images: '[]' };
    component.selectedMovie = movie;
    spyOn(adminService, 'updateMovie').and.returnValue(of({}));
    spyOn(window, 'alert');
    spyOn(component, 'loadMovies');

    component.editMovie(movieId);

    expect(adminService.updateMovie).toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith('Movie updated successfully');
    expect(component.loadMovies).toHaveBeenCalled();
  });

  it('should delete a movie', () => {
    const movieId = '1';
    spyOn(adminService, 'deleteMovie').and.returnValue(of({}));
    spyOn(window, 'alert');
    spyOn(component, 'loadMovies');

    component.deleteMovie(movieId);

    expect(adminService.deleteMovie).toHaveBeenCalledWith(movieId);
    expect(window.alert).toHaveBeenCalledWith('Movie deleted');
    expect(component.loadMovies).toHaveBeenCalled();
  });

  it('should logout the user', () => {
    spyOn(authService, 'logout').and.returnValue(of({}));
    spyOn(router, 'navigate');
    spyOn(window, 'alert');

    component.logout();

    expect(authService.logout).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
    expect(window.alert).toHaveBeenCalledWith('Logout successfully');
  });

  // 测试分页功能
  it('should calculate total pages', () => {
    component.movies = new Array(25);
    expect(component.totalPages).toBe(3);
  });

  it('should navigate to previous page', () => {
    component.currentPage = 2;
    component.previousPage();
    expect(component.currentPage).toBe(1);
  });

  it('should navigate to next page', () => {
    component.currentPage = 1;
    component.movies = new Array(25);
    component.nextPage();
    expect(component.currentPage).toBe(2);
  });

  it('should jump to a specific page', () => {
    component.movies = new Array(25);
    component.gotoPageNumber = 2;
    component.jumpToPage();
    expect(component.currentPage).toBe(2);
  });

  it('should handle invalid page number input', () => {
    spyOn(window, 'alert');
    component.movies = new Array(25);
    component.gotoPageNumber = 4;
    component.jumpToPage();
    expect(component.currentPage).toBe(1);
    expect(window.alert).toHaveBeenCalledWith('Invalid page number');
  });
});