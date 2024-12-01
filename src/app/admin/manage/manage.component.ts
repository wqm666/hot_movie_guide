import { Component, OnInit } from '@angular/core';
import { MoviesService } from '../../services/movies.service';
import { AdminService } from '../../services/admin.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.css']
})
export class ManageComponent implements OnInit {
  userInfo: any = {};
  is_admin: boolean = false;
  users: any[] = [];
  movies: any[] = [];
  newMovie: any = {}; // 用于存储新电影的数据
  selectedMovie: any = {}; // 用于存储选中的电影数据
  showAddMovieForm: boolean = false; // 控制是否显示添加电影表单
  showEditMovieForm: boolean = false; // 控制是否显示编辑电影表单

  currentPage: number = 1;
  moviesPerPage: number = 12;
  gotoPageNumber: number = 1; // 用户输入的页码

  constructor(
    private moviesService: MoviesService,
    private adminService: AdminService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getUserInfo();
    this.loadMovies();
    this.getAllUsers();
  }

  getUserInfo(): void {
    this.authService.getUserInfo().subscribe(data => {
      this.userInfo = data;
      this.is_admin = this.userInfo.is_admin;
    }, error => {
      console.error('Error fetching user info:', error);
    });
  }

  loadMovies(): void {
    this.moviesService.getAllMovies().subscribe(movies => {
      this.movies = movies;
    }, error => {
      console.error('Error fetching movies:', error);
    });
  }

  getAllUsers(): void {
    this.adminService.getAllUsers().subscribe(users => {
      this.users = users;
    }, error => {
      console.error('Error fetching users:', error);
    });
  }

  toggleAdmin(userId: string): void {
    this.adminService.toggleAdmin(userId).subscribe(() => {
      alert('User admin status toggled');
      this.getAllUsers(); // 重新加载用户列表
    }, error => {
      console.error('Error toggling admin status:', error);
      alert('Toggle admin status failed');
    });
  }

  showAddMovieFormToggle(): void {
    this.showAddMovieForm = !this.showAddMovieForm;
  }

  addMovie(): void {
    // 初始化电影的各字段
    this.newMovie.tags = this.newMovie.tags || [];
    this.newMovie.images = this.newMovie.images || [];
    this.newMovie.details = this.newMovie.details || [];
    this.newMovie.videos = this.newMovie.videos || [];
    this.newMovie.feeders = this.newMovie.feeders || [];

    this.adminService.addMovie(this.newMovie).subscribe(() => {
      alert('Movie added successfully');
      this.loadMovies(); // 重新加载电影列表
      this.newMovie = {}; // 重置表单
      this.showAddMovieForm = false; // 隐藏表单
    }, error => {
      console.error('Error adding movie:', error);
      alert('Add movie failed');
    });
  }

  showEditMovieFormToggle(movie: any): void {
    this.selectedMovie = { ...movie };
    this.showEditMovieForm = !this.showEditMovieForm;
  }

  editMovie(movieId: string): void {
    const updatedMovie = { ...this.selectedMovie };

    // 确保各字段是数组
    updatedMovie.tags = Array.isArray(updatedMovie.tags) ? updatedMovie.tags : [];
    updatedMovie.images = Array.isArray(updatedMovie.images) ? updatedMovie.images : [];
    updatedMovie.details = Array.isArray(updatedMovie.details) ? updatedMovie.details : [];
    updatedMovie.videos = Array.isArray(updatedMovie.videos) ? updatedMovie.videos : [];
    updatedMovie.feeders = Array.isArray(updatedMovie.feeders) ? updatedMovie.feeders : [];

    delete updatedMovie._id; // 确保删除 _id 字段
    this.adminService.updateMovie(movieId, updatedMovie).subscribe(() => {
      alert('Movie updated successfully');
      this.loadMovies(); // 重新加载电影列表
      this.selectedMovie = {}; // 重置表单
      this.showEditMovieForm = false; // 隐藏表单
    }, error => {
      console.error('Error updating movie:', error);
      alert('Update movie failed');
    });
  }

  deleteMovie(movieId: string): void {
    this.adminService.deleteMovie(movieId).subscribe(() => {
      alert('Movie deleted');
      this.loadMovies(); // 重新加载电影列表
    }, error => {
      console.error('Error deleting movie:', error);
      alert('Delete movie failed');
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
    if (movie.images && Array.isArray(movie.images)) {
      return movie.images.find((image: any) => image.type === 'Poster')?.url;
    }
    return undefined; // 或者返回一个默认图片的 URL
  }

  isArray(value: any): boolean {
    return Array.isArray(value);
  }

  mapArray(array: any[], key: string): any[] {
    return array.map(item => item[key]);
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
