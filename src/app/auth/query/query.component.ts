import { Component, OnInit } from '@angular/core';
import { MoviesService } from '../../services/movies.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-query',
  templateUrl: './query.component.html',
  styleUrls: ['./query.component.css']
})
export class QueryComponent implements OnInit {
  movies: any[] = [];
  userInfo: any = {};
  is_admin: boolean = false;
  searchQuery: string = '';

  constructor(
    private moviesService: MoviesService,
    private authService: AuthService,
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

  searchMovies(): void {
    if (this.searchQuery.trim()) {
      const criteria = { query: this.searchQuery };
      this.moviesService.filterMovies(criteria).subscribe(movies => {
        this.movies = movies;
      }, error => {
        console.error('Error searching movies:', error);
      });
    } else {
      alert('Please enter a search query');
    }
  }

  handleImageError(event: Event) {
    const target = event.target as HTMLImageElement;
    target.src = '../../../assets/default-image.jpg';  // 设置默认图片路径
  }

  getPosterUrl(movie: any): string | undefined {
    return movie.images?.find((image: any) => image.type === 'Poster')?.url;
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
