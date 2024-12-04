import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';

/**
 * Guard to protect routes that require authentication.
 * @since v1.0.0
 * @autor Zirun Wang
 */
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  /**
   * @constructor
   * @param { AuthService } authService - The authentication service to check login status.
   * @param { Router } router - The router service to navigate if authentication fails.
   */
  constructor(private authService: AuthService, private router: Router) {}

  /**
   * Determines if a route can be activated based on the user's authentication status.
   * @param { ActivatedRouteSnapshot } next - The activated route snapshot.
   * @param { RouterStateSnapshot } state - The router state snapshot.
   * @returns { Observable<boolean> | Promise<boolean> | boolean } - True if the user is authenticated, otherwise false.
   * @since v1.0.0
   */
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    if (this.authService.isLoggedIn()) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}