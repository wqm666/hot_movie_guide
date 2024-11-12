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
  isAdmin: boolean = false;

  currentPage: number = 1;
  moviesPerPage: number = 12;

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
      this.favoritesService.getUserFavorites().subscribe((favorites: any[]) => {
        this.favorites = favorites;
        this.movies = movies.map(movie => {
          const favorite = this.favorites.find(fav => fav.movie_id === movie._id);
          return { ...movie, isFavorite: !!favorite, favorite_id: favorite ? favorite._id : null };
        });
      }, error => {
        console.error('Error fetching favorites:', error);
      });
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

  get currentMovies(): any[] {
    const startIndex = (this.currentPage - 1) * this.moviesPerPage;
    const endIndex = startIndex + this.moviesPerPage;
    return this.movies.slice(startIndex, endIndex);
  }
}
