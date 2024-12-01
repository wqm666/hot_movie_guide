import { Component, OnInit } from '@angular/core';
import { MoviesService } from '../../services/movies.service';
import { FavoritesService } from '../../services/favorites.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  movies: any[] = [];
  favorites: any[] = [];
  userInfo: any = {};
  is_admin: boolean = false;

  currentPage: number = 1;
  moviesPerPage: number = 12;
  gotoPageNumber: number = 1; // 用户输入的页码

  constructor(
    private moviesService: MoviesService,
    private favoritesService: FavoritesService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadMoviesAndFavorites();
    this.getUserInfo();
  }

  loadMoviesAndFavorites(): void {
    this.moviesService.getAllMovies().subscribe((movies: any[]) => {
      this.movies = movies;
      this.favoritesService.getUserFavorites().subscribe((favorites: any[]) => {
        this.favorites = favorites;
        this.updateMoviesWithFavorites();
      }, error => {
        // 处理获取收藏列表失败的情况，仍然加载电影
        console.error('Error fetching favorites:', error);
        this.updateMoviesWithFavorites(); // 即使收藏列表为空，仍需更新电影列表
      });
    }, error => {
      console.error('Error fetching movies:', error);
    });
  }
  
  // 新增一个方法来更新电影的收藏状态
  updateMoviesWithFavorites(): void {
    this.movies = this.movies.map(movie => {
      const favorite = this.favorites.find(fav => fav.movie_id === movie._id);
      return { ...movie, isFavorite: !!favorite, favorite_id: favorite ? favorite._id : null };
    });
  }
  

  getUserInfo(): void {
    this.authService.getUserInfo().subscribe(data => {
      this.userInfo = data;
      this.is_admin = this.userInfo.is_admin;
    }, error => {
      console.error('Error fetching user info:', error);
    });
  }

  addToFavorites(movie_id: string): void {
    this.favoritesService.addFavorite(movie_id).subscribe((favorite) => {
      alert('Movie added to favorites');
      const movie = this.movies.find(m => m._id === movie_id);
      if (movie) {
        movie.isFavorite = true;
        movie.favorite_id = favorite._id;
      }
      this.loadMoviesAndFavorites();
    }, error => {
      console.error('Error adding to favorites:', error);
      alert('Add favorites failed');
    });
  }
  

  removeFromFavorites(favorite_id: string): void {
    this.favoritesService.deleteFavorite(favorite_id).subscribe(() => {
      alert('Movie removed from favorites');
      const movie = this.movies.find(m => m.favorite_id === favorite_id);
      if (movie) {
        movie.isFavorite = false;
        movie.favorite_id = null;
      }
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

  get totalPages(): number {
    return Math.ceil(this.movies.length / this.moviesPerPage);
  }

  setCurrentPage(page: number): void {
    this.currentPage = page;
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  jumpToPage(): void {
    if (this.gotoPageNumber >= 1 && this.gotoPageNumber <= this.totalPages) {
      this.setCurrentPage(this.gotoPageNumber);
    } else {
      alert('Invalid page number');
    }
  }

  get currentMovies(): any[] {
    const startIndex = (this.currentPage - 1) * this.moviesPerPage;
    const endIndex = startIndex + this.moviesPerPage;
    return this.movies.slice(startIndex, endIndex);
  }
}
