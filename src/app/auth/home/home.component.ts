import { Component, OnInit } from '@angular/core';
import { MoviesService } from '../../services/movies.service';
import { FavoritesService } from '../../services/favorites.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

// 定义 Image 接口
interface Image {
  type: string;
  url: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  movies: any[] = [];
  userInfo: any = {};
  isAdmin: boolean = false;

  constructor(
    private moviesService: MoviesService,
    private favoritesService: FavoritesService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getMovies();
    this.getUserInfo();
  }

  getMovies(): void {
    this.moviesService.getAllMovies().subscribe((data: any[]) => {
      this.movies = data;
    }, error => {
      console.error('Error fetching movies:', error);
    });
  }

  getUserInfo(): void {
    this.authService.getUserInfo().subscribe(data => {
      this.userInfo = data;
      this.isAdmin = this.userInfo.isAdmin;
    }, error => {
      console.error('Error fetching user info:', error);
    });
  }

  // 获取海报 URL
  getPosterUrl(movie: any): string | undefined {
    const poster = movie.images?.find((image: Image) => image.type === 'Poster');
    return poster ? poster.url : undefined;
  }

  addToFavorites(movieId: string): void {
    this.favoritesService.addFavorite(movieId).subscribe(() => {
      alert('Movie added to favorites');
    }, error => {
      console.error('Error adding to favorites:', error);
    });
  }

  removeFromFavorites(favoriteId: string): void {
    this.favoritesService.deleteFavorite(favoriteId).subscribe(() => {
      alert('Movie removed from favorites');
    }, error => {
      console.error('Error removing from favorites:', error);
    });
  }

  logout(): void {
    this.authService.logout().subscribe(() => {
      sessionStorage.removeItem('token');
      this.router.navigate(['/login']);
    }, error => {
      console.error('Error logging out:', error);
    });
  } 
}
