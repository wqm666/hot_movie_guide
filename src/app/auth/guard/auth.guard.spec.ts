import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthGuard } from './auth.guard';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let authService: AuthService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [AuthGuard, AuthService]
    });
    guard = TestBed.inject(AuthGuard);
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should activate if user is authenticated', () => {
    spyOn(authService, 'isAuthenticated').and.returnValue(true);
    const route = new ActivatedRouteSnapshot();
    const state = {} as RouterStateSnapshot;
    expect(guard.canActivate(route, state)).toBe(true);
  });

  it('should not activate if user is not authenticated', () => {
    spyOn(authService, 'isAuthenticated').and.returnValue(false);
    const route = new ActivatedRouteSnapshot();
    const state = {} as RouterStateSnapshot;
    expect(guard.canActivate(route, state)).toBe(false);
  });
});
