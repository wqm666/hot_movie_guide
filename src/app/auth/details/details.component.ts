import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MoviesService } from '../../services/movies.service';
import { FavoritesService } from '../../services/favorites.service';

/**
 * Interface for video details.
 * @since v1.0.0
 * @autor Zirun Wang
 */
interface Video {
  kind: string;
  language: string;
  source: string;
  url: string;
}

/**
 * Component for displaying movie details.
 * Handles fetching movie details and managing favorites.
 * @since v1.0.0
 * @autor Your Name
 */
@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {
  /**
   * The details of the movie.
   */
  movie: any;

  /**
   * Indicates whether the movie is a favorite.
   */
  isFavorite: boolean = false;

  /**
   * @constructor
   * @param { ActivatedRoute } route - The activated route service used for accessing route parameters.
   * @param { MoviesService } moviesService - The service used for fetching movie details.
   * @param { FavoritesService } favoritesService - The service used for managing favorite movies.
   */
  constructor(
    private route: ActivatedRoute,
    private moviesService: MoviesService,
    private favoritesService: FavoritesService,
  ) {}

  /**
   * Lifecycle hook that is called after data-bound properties are initialized.
   * Fetches movie details on component initialization.
   * @since v1.0.0
   */
  ngOnInit(): void {
    this.getMovieDetails();
  }

  /**
   * Fetches the details of the movie based on the route parameter.
   * @since v1.0.0
   */
  getMovieDetails(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.moviesService.getMovieById(id).subscribe((movie: any) => {
        this.movie = movie;
        this.checkIfFavorite();
      }, error => {
        console.error('Error fetching movie details:', error);
      });
    }
  }

  /**
   * Checks if the movie is in the user's favorites.
   * @since v1.0.0
   */
  checkIfFavorite(): void {
    this.favoritesService.getUserFavorites().subscribe((favorites: any[]) => {
      this.isFavorite = favorites.some(favorite => favorite.movie_id === this.movie._id);
    }, error => {
      console.error('Error fetching favorites:', error);
    });
  }

  /**
   * Adds the movie to the user's favorites.
   * @since v1.0.0
   */
  addToFavorites(): void {
    if (this.movie) {
      this.favoritesService.addFavorite(this.movie._id).subscribe(() => {
        this.isFavorite = true;
      }, error => {
        console.error('Error adding to favorites:', error);
      });
    }
  }

  /**
   * Removes the movie from the user's favorites.
   * @since v1.0.0
   */
  removeFromFavorites(): void {
    if (this.movie) {
      this.favoritesService.getUserFavorites().subscribe((favorites: any[]) => {
        const favorite = favorites.find(fav => fav.movie_id === this.movie._id);
        if (favorite) {
          this.favoritesService.deleteFavorite(favorite._id).subscribe(() => {
            this.isFavorite = false;
          }, error => {
            console.error('Error removing from favorites:', error);
          });
        }
      }, error => {
        console.error('Error fetching favorites:', error);
      });
    }
  }
}