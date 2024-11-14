import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FavoritesService } from '../../services/favorites.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.css']
})
export class UserInfoComponent implements OnInit {
  userInfo: any = {};
  favorites: any[] = [];
  is_admin: boolean = false;
  editing: boolean = false;

  constructor(
    private authService: AuthService,
    private favoritesService: FavoritesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getUserInfo();
  }

  getUserInfo(): void {
    this.authService.getUserInfo().subscribe(data => {
      this.userInfo = data;
      this.is_admin = this.userInfo.is_admin;
    }, error => {
      console.error('Error fetching user info:', error);
    });
  }

  getUserFavorites(): void {
    this.favoritesService.getUserFavorites().subscribe(data => {
      this.favorites = data;
    }, error => {
      console.error('Error fetching favorites:', error);
    });
  }

  updateUserInfo(): void {
    this.authService.updateUserInfo(this.userInfo).subscribe(() => {
      alert('User information updated successfully');
      this.editing = false;
    }, error => {
      console.error('Error updating user info:', error);
    });
  }

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
