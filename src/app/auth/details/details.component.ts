import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MoviesService } from '../../services/movies.service';
import { FavoritesService } from '../../services/favorites.service';

interface Video {
  kind: string;
  language: string;
  source: string;
  url: string;
}

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {
  movie: any;
  isFavorite: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private moviesService: MoviesService,
    private favoritesService: FavoritesService,
  ) {}

  ngOnInit(): void {
    this.getMovieDetails();
  }

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

  checkIfFavorite(): void {
    this.favoritesService.getUserFavorites().subscribe((favorites: any[]) => {
      this.isFavorite = favorites.some(favorite => favorite.movie_id === this.movie._id);
    }, error => {
      console.error('Error fetching favorites:', error);
    });
  }

  addToFavorites(): void {
    if (this.movie) {
      this.favoritesService.addFavorite(this.movie._id).subscribe(() => {
        this.isFavorite = true;
      }, error => {
        console.error('Error adding to favorites:', error);
      });
    }
  }

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
