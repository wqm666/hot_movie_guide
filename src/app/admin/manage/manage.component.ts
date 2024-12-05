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
  newMovie: any = {};
  selectedMovie: any = {};
  showAddMovieForm: boolean = false;
  showEditMovieForm: boolean = false;

  currentPage: number = 1;
  moviesPerPage: number = 12;
  gotoPageNumber: number = 1;

  constructor(
    private moviesService: MoviesService,
    private adminService: AdminService,
    private authService: AuthService,
    private router: Router
  ) { }

  /**
   * Initializes the component by fetching user info, loading movies, and fetching all users.
   * @since v1.0.0
   */
  ngOnInit(): void {
    this.getUserInfo();
    this.loadMovies();
    this.getAllUsers();
  }

  /**
   * Fetches the user information.
   * @since v1.0.0
   */
  getUserInfo(): void {
    this.authService.getUserInfo().subscribe(data => {
      this.userInfo = data;
      this.is_admin = this.userInfo.is_admin;
    }, error => {
      console.error('Error fetching user info:', error);
    });
  }

  /**
   * Loads all movies.
   * @since v1.0.0
   */
  loadMovies(): void {
    this.moviesService.getAllMovies().subscribe(movies => {
      this.movies = movies;
    }, error => {
      console.error('Error fetching movies:', error);
    });
  }

  /**
   * Fetches all users.
   * @since v1.0.0
   */
  getAllUsers(): void {
    this.adminService.getAllUsers().subscribe(users => {
      this.users = users;
    }, error => {
      console.error('Error fetching users:', error);
    });
  }

  /**
   * Toggles admin status for a user.
   * @param { string } userId - The user ID.
   * @since v1.0.0
   */
  toggleAdmin(userId: string): void {
    this.adminService.toggleAdmin(userId).subscribe(() => {
      alert('User admin status toggled');
      this.getAllUsers();
    }, error => {
      console.error('Error toggling admin status:', error);
      alert('Toggle admin status failed');
    });
  }

  /**
   * Toggles the add movie form and sets default new movie data.
   * @since v1.0.0
   */
  showAddMovieFormToggle(): void {
    this.showAddMovieForm = !this.showAddMovieForm;

    if (this.showAddMovieForm) {
      this.newMovie = {
        title: 'Spermageddon',
        language: 'no',
        release_date: '2025-02-27',
        duration: 90,
        tags: JSON.stringify(["animation", "Norwegian"], null, 2),
        details: JSON.stringify([
          {
            id: 7829,
            language: 'en',
            title: 'Spermageddon',
            director: 'Tommy Wirkola',
            tagline: '',
            cast: 'Christian Mikkelsen, Nasrin Khusrawi, Aksel Hennie, Mathilde Storm, Christian Rubeck, Bjørn Sundquist',
            storyline: 'Two narrative threads- one is an emerging love story between two awkward teens, Jens and Lisa, who are having sex for the first time and the other is an eventful quest of Simon the Semen and his friends to reach the golden goal, the Egg.'
          }
        ], null, 2),
        videos: JSON.stringify([
          {
            url: 'https://youtu.be/JUCmChRK8aY',
            source: '#1',
            kind: 'Teaser',
            language: 'no'
          }
        ], null, 2),
        images: JSON.stringify([
          {
            url: 'https://passport-go.everyday.in.th/m/stth/2024/10/bc2b921e7fa98e6db571d3b12b8ac8160cbf34a6.jpg?w=700&format=webp',
            type: 'Poster',
            order: 4
          },
          {
            url: 'https://passport-go.everyday.in.th/m/stth/?w=700&format=webp',
            type: 'Backdrop',
            order: 4
          },
          {
            url: 'https://passport-go.everyday.in.th/m/stth/2024/10/ba3d438711f4ed1badef29dc0efdb69873f5bed1.jpg?w=700&format=webp',
            type: 'Poster',
            order: 3
          },
          {
            url: 'https://passport-go.everyday.in.th/m/stth/2024/10/0f586c046f266cecbabdd7d168b4647a3fefe6c3.jpg?w=700&format=webp',
            type: 'Poster',
            order: 1
          }
        ], null, 2),
        feeders: JSON.stringify([
          {
            name: 'sf',
            url: 'https://www.sfcinemacity.com/movie/Spermageddon.HO00002124'
          },
          {
            name: 'tmdb',
            url: 'https://www.themoviedb.org/movie/1064307'
          }
        ], null, 2)
      };
    }
  }

  /**
   * Toggles the edit movie form and sets selected movie data.
   * @param { any } movie - The movie object.
   * @since v1.0.0
   */
  showEditMovieFormToggle(movie: any): void {
    this.selectedMovie = { ...movie };
    this.selectedMovie.tags = JSON.stringify(this.selectedMovie.tags, null, 2);
    this.selectedMovie.details = JSON.stringify(this.selectedMovie.details, null, 2);
    this.selectedMovie.videos = JSON.stringify(this.selectedMovie.videos, null, 2);
    this.selectedMovie.feeders = JSON.stringify(this.selectedMovie.feeders, null, 2);
    this.selectedMovie.images = JSON.stringify(this.selectedMovie.images, null, 2);
    this.showEditMovieForm = !this.showEditMovieForm;
  }

  /**
   * Adds a new movie.
   * @since v1.0.0
   */
  addMovie(): void {
    try {
      this.newMovie.tags = JSON.parse(this.newMovie.tags);
      this.newMovie.details = JSON.parse(this.newMovie.details);
      this.newMovie.videos = JSON.parse(this.newMovie.videos);
      this.newMovie.feeders = JSON.parse(this.newMovie.feeders);
      this.newMovie.images = JSON.parse(this.newMovie.images);
    } catch (error) {
      console.error('Error parsing JSON:', error);
      alert('Please ensure all JSON fields are correctly formatted.');
      return;
    }

    this.adminService.addMovie(this.newMovie).subscribe(() => {
      alert('Movie added successfully');
      this.loadMovies();
      this.newMovie = {
        title: '',
        language: '',
        release_date: '',
        duration: 0,
        tags: [],
        details: [],
        videos: [],
        images: [],
        feeders: []
      };
      this.showAddMovieForm = false;
    }, error => {
      console.error('Error adding movie:', error);
      alert('Add movie failed');
    });
  }

  /**
   * Edits an existing movie.
   * @param { string } movieId - The movie ID.
   * @since v1.0.0
   */
  editMovie(movieId: string): void {
    let updatedMovie;
    try {
      const parsedTags = JSON.parse(this.selectedMovie.tags);
      const parsedDetails = JSON.parse(this.selectedMovie.details);
      const parsedVideos = JSON.parse(this.selectedMovie.videos);
      const parsedFeeders = JSON.parse(this.selectedMovie.feeders);
      const parsedImages = JSON.parse(this.selectedMovie.images);

      const { _id, ...otherFields } = this.selectedMovie;
      updatedMovie = {
        ...otherFields,
        tags: parsedTags,
        details: parsedDetails,
        videos: parsedVideos,
        feeders: parsedFeeders,
        images: parsedImages
      };
    } catch (error) {
      console.error('Error parsing JSON:', error);
      alert('Please ensure all JSON fields are correctly formatted.');
      return;
    }

    this.adminService.updateMovie(movieId, updatedMovie).subscribe(() => {
      alert('Movie updated successfully');
      this.loadMovies();
      this.selectedMovie = {};
      this.showEditMovieForm = false;
    }, error => {
      console.error('Error updating movie:', error);
      alert('Update movie failed');
    });
  }

  /**
   * Deletes a movie.
   * @param { string } movieId - The movie ID.
   * @since v1.0.0
   */
  deleteMovie(movieId: string): void {
    this.adminService.deleteMovie(movieId).subscribe(() => {
      alert('Movie deleted');
      this.loadMovies();
    }, error => {
      console.error('Error deleting movie:', error);
      alert('Delete movie failed');
    });
  }

  /**
   * Logs the user out and navigates to the login page.
   * @since v1.0.0
   */
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

  /**
   * Retrieves the URL of the movie's poster.
   * @param { any } movie - The movie object.
   * @returns { string | undefined } - The URL of the poster image, or a default URL if not found.
   * @since v1.0.0
   */
  getPosterUrl(movie: any): string | undefined {
    const posterUrl = movie.images.find((image: any) => image.type === 'Poster')?.url;
    return posterUrl || '../../../assets/logo.jpg';
  }

  /**
   * Checks if a value is an array.
   * @param { any } value - The value to check.
   * @returns { boolean } - True if the value is an array, otherwise false.
   * @since v1.0.0
   */
  isArray(value: any): boolean {
    return Array.isArray(value);
  }

  /**
   * Maps an array of objects to an array of specific key values.
   * @param { any[] } array - The array of objects.
   * @param { string } key - The key to map.
   * @returns { any[] } - An array of key values.
   * @since v1.0.0
   */
  mapArray(array: any[], key: string): any[] {
    return array.map(item => item[key]);
  }

  /**
   * Gets the total number of pages.
   * @returns { number } - The total number of pages.
   * @since v1.0.0
   */
  get totalPages(): number {
    return Math.ceil(this.movies.length / this.moviesPerPage);
  }

  /**
   * Sets the current page number.
   * @param { number } page - The page number to set.
   * @since v1.0.0
   */
  setCurrentPage(page: number): void {
    this.currentPage = page;
  }

  /**
   * Goes to the previous page.
   * @since v1.0.0
   */
  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  /**
   * Goes to the next page.
   * @since v1.0.0
   */
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  /**
   * Jumps to a specific page number.
   * @since v1.0.0
   */
  jumpToPage(): void {
    if (this.gotoPageNumber >= 1 && this.gotoPageNumber <= this.totalPages) {
      this.setCurrentPage(this.gotoPageNumber);
    } else {
      alert('Invalid page number');
    }
  }

  /**
   * Gets the movies for the current page.
   * @returns { any[] } - An array of movies for the current page.
   * @since v1.0.0
   */
  get currentMovies(): any[] {
    const startIndex = (this.currentPage - 1) * this.moviesPerPage;
    const endIndex = startIndex + this.moviesPerPage;
    return this.movies.slice(startIndex, endIndex);
  }
}