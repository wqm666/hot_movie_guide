import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FavoritesService } from '../../services/favorites.service';
import { Router } from '@angular/router';

/**
 * Component for displaying and managing user information.
 * Handles fetching and updating user information, managing favorites, and user account actions.
 * @since v1.0.0
 * @autor Zirun Wang
 */
@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.css']
})
export class UserInfoComponent implements OnInit {
  /**
   * The user's information.
   */
  userInfo: any = {};

  /**
   * The user's favorite movies.
   */
  favorites: any[] = [];

  /**
   * Indicates if the user is an admin.
   */
  is_admin: boolean = false;

  /**
   * Indicates if the user is in editing mode.
   */
  editing: boolean = false;

  /**
   * @constructor
   * @param { AuthService } authService - The authentication service used for fetching and updating user info.
   * @param { FavoritesService } favoritesService - The service used for managing user favorites.
   * @param { Router } router - The router service used for navigation.
   */
  constructor(
    private authService: AuthService,
    private favoritesService: FavoritesService,
    private router: Router
  ) {}

  /**
   * Lifecycle hook that is called after data-bound properties are initialized.
   * Fetches user information on component initialization.
   * @since v1.0.0
   */
  ngOnInit(): void {
    this.getUserInfo();
  }

  /**
   * Fetches the user's information from the server.
   * @since v1.0.0
   */
  getUserInfo(): void {
    this.authService.getUserInfo().subscribe(data => {
      this.userInfo = data;
      this.is_admin = this.userInfo.is_admin;
    }, error => {
      console.error('Error fetching user info:', error);
    });
  }

  /**
   * Fetches the user's favorite movies from the server.
   * @since v1.0.0
   */
  getUserFavorites(): void {
    this.favoritesService.getUserFavorites().subscribe(data => {
      this.favorites = data;
    }, error => {
      console.error('Error fetching favorites:', error);
    });
  }

  /**
   * Updates the user's information on the server.
   * @since v1.0.0
   */
  updateUserInfo(): void {
    this.authService.updateUserInfo(this.userInfo).subscribe(() => {
      alert('User information updated successfully');
      this.editing = false;
    }, error => {
      console.error('Error updating user info:', error);
    });
  }

  /**
   * Deletes the user's account after confirmation.
   * @since v1.0.0
   */
  deleteUser(): void {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      this.authService.deleteUser().subscribe(() => {
        alert('Your account has been deleted.');
        this.router.navigate(['/login']);
      }, error => {
        console.error('Error deleting user:', error);
      });
    }
  }

  /**
   * Logs out the user and navigates to the login page.
   * @since v1.0.0
   */
  logout(): void {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/login']);
      alert('Logout successfully');
    }, error => {
      console.error('Error logging out:', error);
      alert('Logout failed');
    });
  }
}