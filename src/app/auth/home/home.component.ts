import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MovieService } from '../../movies/movie.service';
import { AuthService } from '..services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  movies: any[] = [];
  dropdownOpen = false;

  constructor(
    private movieService: MovieService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getMovies();
  }

  getMovies(): void {
    this.movieService.getAllMovies().subscribe((data: any[]) => {
      this.movies = data;
    }, error => {
      console.error('Error fetching movies:', error);
    });
  }

  viewMovieDetails(movieId: string): void {
    this.router.navigate(['/movies', movieId]);
  }

  toggleFavorite(movieId: string): void {
    // 调用收藏API
    this.movieService.toggleFavorite(movieId).subscribe(response => {
      console.log('Favorite toggled:', response);
    }, error => {
      console.error('Error toggling favorite:', error);
    });
  }

  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

  viewProfile(): void {
    this.router.navigate(['/user-info']);
  }

  logout(): void {
    this.authService.logout().subscribe(response => {
      console.log('Logged out:', response);
      this.router.navigate(['/login']);
    }, error => {
      console.error('Error logging out:', error);
    });
  }
}
