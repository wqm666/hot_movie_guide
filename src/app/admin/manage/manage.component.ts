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

  addMovie(): void {
    // 显示添加电影的表单，获取输入数据并调用添加电影的 API
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

  editMovie(movieId: string): void {
    // 显示编辑电影的表单，获取输入数据并调用更新电影的 API
  }

  updateMovie(): void {
    // 更新电影信息的方法
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
