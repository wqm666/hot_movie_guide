import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { AuthService } from '../../services/auth.service';

describe('AuthGuard', () => {
  let authGuard: AuthGuard;
  let authService: jasmine.SpyObj<AuthService>;
  let router: Router;

  beforeEach(() => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['isLoggedIn']);

    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([])],
      providers: [
        AuthGuard,
        { provide: AuthService, useValue: authServiceSpy }
      ]
    });

    authGuard = TestBed.inject(AuthGuard);
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(authGuard).toBeTruthy();
  });

  it('should allow the authenticated user to access app', () => {
    authService.isLoggedIn.and.returnValue(true);
    const routeSnapshot: any = {};
    const stateSnapshot: any = {};

    expect(authGuard.canActivate(routeSnapshot, stateSnapshot)).toBe(true);
    expect(authService.isLoggedIn).toHaveBeenCalled();
  });

  it('should redirect an unauthenticated user to the login route', () => {
    authService.isLoggedIn.and.returnValue(false);
    spyOn(router, 'navigate');

    const routeSnapshot: any = {};
    const stateSnapshot: any = {};

    expect(authGuard.canActivate(routeSnapshot, stateSnapshot)).toBe(false);
    expect(authService.isLoggedIn).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });
});