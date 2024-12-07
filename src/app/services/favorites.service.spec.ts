import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FavoritesService } from './favorites.service';

describe('FavoritesService', () => {
  let service: FavoritesService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [FavoritesService]
    });
    service = TestBed.inject(FavoritesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should add a movie to favorites', () => {
    const dummyResponse = { success: true };
    const movieId = '123';

    service.addFavorite(movieId).subscribe(response => {
      expect(response).toEqual(dummyResponse);
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ movie_id: movieId });
    req.flush(dummyResponse);
  });

  it('should get user favorites', () => {
    const dummyFavorites = [
      { title: 'Movie 1', language: 'en' },
      { title: 'Movie 2', language: 'fr' }
    ];

    service.getUserFavorites().subscribe(favorites => {
      expect(favorites.length).toBe(2);
      expect(favorites).toEqual(dummyFavorites);
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/user`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyFavorites);
  });

  it('should delete a favorite movie', () => {
    const dummyResponse = { success: true };
    const favoriteId = '456';

    service.deleteFavorite(favoriteId).subscribe(response => {
      expect(response).toEqual(dummyResponse);
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/${favoriteId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(dummyResponse);
  });
});