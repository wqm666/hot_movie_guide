import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FavoritesService } from '../../services/favorites.service';
import { Router } from '@angular/router';

/**
 * Component for displaying and managing user information.
 * Handles fetching and updating user information, managing favorites, and user account actions.
 * The component allows users to view their profile, update personal information, manage their favorite movies,
 * and delete their account or log out.
 * @since v1.0.0
 * @author Zirun Wang
 */
@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.css']
})
export class UserInfoComponent implements OnInit {
  /**
   * The user's information retrieved from the server, including profile details and admin status.
   * This data is used to display the user's profile and manage their information.
   * @type {any}
   */
  userInfo: any = {};

  /**
   * The user's favorite movies fetched from the server.
   * This list is used to display and manage the user's favorite movies.
   * @type {any[]}
   */
  favorites: any[] = [];

  /**
   * Indicates if the user is an admin. This flag is used to display admin-specific UI elements.
   * @type {boolean}
   */
  is_admin: boolean = false;

  /**
   * Indicates if the user is in editing mode for their profile. This flag controls the visibility of editing fields.
   * @type {boolean}
   */
  editing: boolean = false;

  /**
   * @constructor
   * @param { AuthService } authService - The authentication service used for fetching and updating user info.
   * This service is responsible for interacting with the backend for authentication and user data management.
   * @param { FavoritesService } favoritesService - The service used for managing user favorites.
   * This service communicates with the backend to retrieve and update the user's favorite movies.
   * @param { Router } router - The router service used for navigation.
   * This service is used to navigate the user to different pages after actions like logout or account deletion.
   */
  constructor(
    private authService: AuthService,
    private favoritesService: FavoritesService,
    private router: Router
  ) {}

  /**
   * Lifecycle hook that is called after data-bound properties are initialized.
   * Fetches user information when the component is initialized.
   * This method triggers the call to fetch user data and sets up initial values for `userInfo` and `is_admin`.
   * @since v1.0.0
   */
  ngOnInit(): void {
    this.getUserInfo();
    this.getUserFavorites();
  }

  /**
   * Fetches the user's information from the server.
   * The data includes personal information and user status, such as whether the user is an admin.
   * On success, it updates the `userInfo` and `is_admin` properties.
   * On error, logs the error to the console for debugging.
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
   * On success, updates the `favorites` array to display the list of favorite movies.
   * On error, logs the error to the console.
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
   * Sends the updated user data to the backend for processing.
   * On success, shows a success message and exits the editing mode.
   * On error, logs the error to the console.
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
   * Deletes the user's account after confirmation from the user.
   * If the user confirms the action, it sends a request to the server to delete the account.
   * On success, shows a confirmation message and redirects to the login page.
   * On error, logs the error to the console.
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
   * Logs out the user and redirects them to the login page.
   * After successful logout, shows a confirmation message.
   * If logout fails, an error message is displayed.
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