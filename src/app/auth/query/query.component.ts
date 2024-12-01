import { Component, OnInit } from '@angular/core';
import { MoviesService } from '../../services/movies.service';
import { FavoritesService } from '../../services/favorites.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-query',
  templateUrl: './query.component.html',
  styleUrls: ['./query.component.css']
})
export class QueryComponent implements OnInit {
  movies: any[] = [];
  favorites: any[] = [];
  currentMovies: any[] = [];
  userInfo: any = {};
  is_admin: boolean = false;
  searchQuery: string = '';
  queryType: string = 'id';
  sortField: string = 'release_date'; // 默认排序字段
  sortOrder: number = 1; // 默认升序排序
  filterLanguage: string = ''; // 默认筛选语言
  criteria: any = {}; // 用于聚合条件
  currentPage: number = 1; // 当前页码
  totalPages: number = 1; // 总页数
  moviesPerPage: number = 12; // 每页显示电影数量
  gotoPageNumber: number = 1; // 用户输入的页码

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
        this.updateMovieFavoriteStatus();
      }
    }, error => {
      if (error.status === 404) {
        this.favorites = [];
      } else {
        console.error('Error fetching favorites:', error);
      }
    });
  }

  loadMovies(): void {
    this.moviesService.getAllMovies().subscribe(movies => {
      this.movies = movies;
      this.updateMovieFavoriteStatus();
      this.updatePagination();
    }, error => {
      console.error('Error fetching movies:', error);
    });
  }

  updateMovieFavoriteStatus(): void {
    this.movies.forEach(movie => {
      const favorite = this.favorites.find(f => f.movie_id === movie._id);
      if (favorite) {
        movie.isFavorite = true;
        movie.favorite_id = favorite._id;
      } else {
        movie.isFavorite = false;
        delete movie.favorite_id;
      }
    });
  }

  filterMovies(): void {
    const criteria = { language: this.filterLanguage };
    this.moviesService.filterMovies(criteria).subscribe(movies => {
      this.movies = movies;
      this.updateMovieFavoriteStatus();
      this.updatePagination();
    }, error => {
      console.error('Error filtering movies:', error);
      this.movies = [];
      this.updatePagination();
    });
  }

  sortMovies(): void {
    const criteria = { [this.sortField]: Number(this.sortOrder) };
    this.moviesService.sortMovies(criteria).subscribe(movies => {
      this.movies = movies;
      this.updateMovieFavoriteStatus();
      this.updatePagination();
    }, error => {
      console.error('Error sorting movies:', error);
      this.movies = [];
      this.updatePagination();
    });
  }

  aggregateMovies(): void {
    const criteria = [
      { $group: { _id: "$language", total_movies: { $sum: 1 }, average_duration: { $avg: "$duration" } } }
    ];
    this.moviesService.aggregateMovies(criteria).subscribe(results => {
      this.movies = results;
      this.updateMovieFavoriteStatus();
      this.updatePagination();
    }, error => {
      console.error('Error aggregating movies:', error);
      this.movies = [];
      this.updatePagination();
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

  handleImageError(event: Event) {
    const target = event.target as HTMLImageElement;
    target.src = '../../../assets/default-image.jpg'; // 设置默认图片路径
  }

  getPosterUrl(movie: any): string | undefined {
    return movie.images?.find((image: any) => image.type === 'Poster')?.url;
  }

  addToFavorites(movie_id: string): void {
    this.favoritesService.addFavorite(movie_id).subscribe(() => {
      alert('Movie added to favorites');
      this.getUserFavorites(); // 重新加载收藏状态
    }, error => {
      console.error('Error adding to favorites:', error);
      alert('Add favorites failed');
    });
  }

  removeFromFavorites(favorite_id: string): void {
    this.favoritesService.deleteFavorite(favorite_id).subscribe(() => {
      alert('Movie removed from favorites');
      this.getUserFavorites(); // 重新加载收藏状态
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
}