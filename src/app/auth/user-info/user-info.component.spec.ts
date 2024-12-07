import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserInfoComponent } from './user-info.component';
import { AuthService } from '../../services/auth.service';
import { FavoritesService } from '../../services/favorites.service';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('UserInfoComponent', () => {
  let component: UserInfoComponent;
  let fixture: ComponentFixture<UserInfoComponent>;
  let authService: AuthService;
  let favoritesService: FavoritesService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule, FormsModule],
      declarations: [UserInfoComponent],
      providers: [AuthService, FavoritesService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserInfoComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    favoritesService = TestBed.inject(FavoritesService);
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

  it('should fetch user favorites', () => {
    const favorites = [{ movie_id: '1', _id: 'fav1' }];
    spyOn(favoritesService, 'getUserFavorites').and.returnValue(of(favorites));

    component.getUserFavorites();

    expect(favoritesService.getUserFavorites).toHaveBeenCalled();
    expect(component.favorites).toEqual(favorites);
  });

  it('should update user info successfully', () => {
    spyOn(authService, 'updateUserInfo').and.returnValue(of({}));
    spyOn(window, 'alert');

    component.userInfo = { username: 'updatedUser' };
    component.updateUserInfo();

    expect(authService.updateUserInfo).toHaveBeenCalledWith({ username: 'updatedUser' });
    expect(window.alert).toHaveBeenCalledWith('User information updated successfully');
    expect(component.editing).toBe(false);
  });

  it('should handle user info update failure', () => {
    spyOn(authService, 'updateUserInfo').and.returnValue(throwError({ status: 500 }));
    spyOn(window, 'alert');

    component.userInfo = { username: 'updatedUser' };
    component.updateUserInfo();

    expect(authService.updateUserInfo).toHaveBeenCalledWith({ username: 'updatedUser' });
    expect(window.alert).not.toHaveBeenCalledWith('User information updated successfully');
    expect(component.editing).toBe(true);
  });

  it('should delete user account after confirmation', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    spyOn(authService, 'deleteUser').and.returnValue(of({}));
    spyOn(router, 'navigate');
    spyOn(window, 'alert');

    component.deleteUser();

    expect(authService.deleteUser).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
    expect(window.alert).toHaveBeenCalledWith('Your account has been deleted.');
  });

  it('should not delete user account if not confirmed', () => {
    spyOn(window, 'confirm').and.returnValue(false);
    spyOn(authService, 'deleteUser');
    spyOn(router, 'navigate');

    component.deleteUser();

    expect(authService.deleteUser).not.toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalled();
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

  it('should handle logout failure', () => {
    spyOn(authService, 'logout').and.returnValue(throwError({ status: 500 }));
    spyOn(window, 'alert');

    component.logout();

    expect(authService.logout).toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith('Logout failed');
  });
});