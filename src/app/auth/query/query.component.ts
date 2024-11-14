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
  moviesPerPage: number = 10; // 每页显示电影数量

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

  searchById(): void {
    const baseId = '67167639ee56fe2ac14628e0';
    const hexId = (parseInt(this.searchQuery, 10) + parseInt(baseId, 16)).toString(16);
    this.moviesService.getMovieById(hexId).subscribe(movie => {
      this.movies = [movie];
      this.updatePagination();
    }, error => {
      console.error('Error fetching movie by ID:', error);
      this.movies = [];
      this.updatePagination();
    });
  }

  filterMovies(): void {
    const criteria = { language: this.filterLanguage };
    this.moviesService.filterMovies(criteria).subscribe(movies => {
      this.movies = movies;
      this.updatePagination();
    }, error => {
      console.error('Error filtering movies:', error);
      this.movies = [];
      this.updatePagination();
    });
  }

  sortMovies(): void {
    const criteria = { [this.sortField]: this.sortOrder };
    this.moviesService.sortMovies(criteria).subscribe(movies => {
      this.movies = movies;
      this.updatePagination();
    }, error => {
      console.error('Error sorting movies:', error);
      this.movies = [];
      this.updatePagination();
    });
  }

  aggregateMovies(): void {
    const criteria = [
      { $group: { _id: "$details.director", total_movies: { $sum: 1 }, average_duration: { $avg: "$duration" } } }
    ];
    this.moviesService.aggregateMovies(criteria).subscribe(movies => {
      this.movies = movies;
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

  handleImageError(event: Event) {
    const target = event.target as HTMLImageElement;
    target.src = '../../../assets/default-image.jpg'; // 设置默认图片路径
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
