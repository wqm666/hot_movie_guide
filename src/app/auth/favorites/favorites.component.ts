import { Component, OnInit } from '@angular/core';
import { MoviesService } from '../../services/movies.service';
import { FavoritesService } from '../../services/favorites.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css']
})
export class FavoritesComponent implements OnInit {
  movies: any[] = [];
  favorites: any[] = [];
  userInfo: any = {};
  is_admin: boolean = false;
  currentPage: number = 1;
  moviesPerPage: number = 12;
  gotoPageNumber: number = 1; // 用户输入的页码
  totalPages: number = 1; // 初始化总页数变量
  currentMovies: any[] = []; // 用于存储当前显示的电影列表

  constructor(
    private moviesService: MoviesService,
    private favoritesService: FavoritesService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getUserInfo();
    this.getUserFavorites();
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
    this.favoritesService.getUserFavorites().subscribe(favorites => {
      this.favorites = favorites;
      if (this.favorites.length > 0) {
        this.loadFavoriteMovies();
      }
      this.updatePagination();
    }, error => {
      if (error.status === 404) {
        // 处理404错误，表示没有收藏电影
        this.favorites = [];
        this.updatePagination();
      } else {
        console.error('Error fetching favorites:', error);
      }
    });
  }

  loadFavoriteMovies(): void {
    this.movies = [];
    this.favorites.forEach(favorite => {
      this.moviesService.getMovieById(favorite.movie_id).subscribe(movie => {
        this.movies.push({ ...movie, favorite_id: favorite._id, isFavorite: true });
        this.updatePagination();
      }, error => {
        console.error('Error fetching movie:', error);
      });
    });
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.movies.length / this.moviesPerPage);
    this.currentMovies = this.movies.slice((this.currentPage - 1) * this.moviesPerPage, this.currentPage * this.moviesPerPage);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  jumpToPage(): void {
    if (this.gotoPageNumber >= 1 && this.gotoPageNumber <= this.totalPages) {
      this.currentPage = this.gotoPageNumber;
      this.updatePagination();
    } else {
      alert('Invalid page number');
    }
  }

  addToFavorites(movie_id: string): void {
    this.favoritesService.addFavorite(movie_id).subscribe((favorite) => {
      alert('Movie added to favorites');
      this.loadFavoriteMovies();
    }, error => {
      console.error('Error adding to favorites:', error);
      alert('Add favorites failed');
    });
  }

  removeFromFavorites(favorite_id: string): void {
    this.favoritesService.deleteFavorite(favorite_id).subscribe(() => {
      alert('Movie removed from favorites');
      this.movies = this.movies.filter(movie => movie.favorite_id !== favorite_id);
      this.updatePagination();
    }, error => {
      console.error('Error removing from favorites:', error);
      alert('Remove favorites failed');
    });
  }

  logout(): void {
    this.authService.logout().subscribe(() => {
      sessionStorage.removeItem('token');
      this.router.navigate(['/login']);
      alert('Logout successfully');
    }, error => {
      console.error('Error logging out:', error);
      alert('Logout failed');
    });
  }

  handleImageError(event: Event) {
    const target = event.target as HTMLImageElement;
    target.src = '../../../assets/default-image.jpg';  // 设置默认图片路径
  }

  getPosterUrl(movie: any): string | undefined {
    return movie.images.find((image: any) => image.type === 'Poster')?.url;
  }
}
