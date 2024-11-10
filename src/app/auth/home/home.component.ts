import { Component, OnInit } from '@angular/core';
import { MoviesService } from '../../services/movies.service';
import { AuthService } from '../../services/auth.service';
import { FavoritesService } from '../../services/favorites.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  movies: any[] = [];

  constructor(
    private moviesService: MoviesService,
    private authService: AuthService,
    private favoritesService: FavoritesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getMovies();
  }

  getMovies(): void {
    this.moviesService.getAllMovies().subscribe(
      (data: any[]) => {
        this.movies = data;
      },
      error => {
        console.error('Error fetching movies:', error);
      }
    );
  }

  viewMovieDetails(movieId: string): void {
    this.router.navigate(['/details', movieId]);
  }

  toggleFavorite(movieId: string): void {
    // 假设我们有一个方法来检查是否已经收藏
    if (this.isFavorite(movieId)) {
      this.favoritesService.deleteFavorite(movieId).subscribe(
        response => {
          console.log('Favorite removed:', response);
        },
        error => {
          console.error('Error removing favorite:', error);
        }
      );
    } else {
      this.favoritesService.addFavorite(movieId).subscribe(
        response => {
          console.log('Favorite added:', response);
        },
        error => {
          console.error('Error adding favorite:', error);
        }
      );
    }
  }

  isFavorite(movieId: string): boolean {
    // 这里应该有一个实际的检查逻辑
    return false;
  }

  viewUserInfo(): void {
    this.router.navigate(['/user-info']);
  }

  logout(): void {
    this.authService.logout().subscribe(
      response => {
        console.log('Logged out:', response);
        this.router.navigate(['/login']);
      },
      error => {
        console.error('Error logging out:', error);
      }
    );
  }

  searchMovies(): void {
    this.router.navigate(['/query']);
  }
}
