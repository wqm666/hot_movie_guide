import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MoviesService } from './movies.service';

describe('MoviesService', () => {
  let service: MoviesService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MoviesService]
    });
    service = TestBed.inject(MoviesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should retrieve all movies', () => {
    const dummyMovies = [
      { title: 'Movie 1', language: 'en', release_date: '2022-01-01' },
      { title: 'Movie 2', language: 'fr', release_date: '2022-02-01' }
    ];

    service.getAllMovies().subscribe(movies => {
      expect(movies.length).toBe(2);
      expect(movies).toEqual(dummyMovies);
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyMovies);
  });

  it('should retrieve a movie by id', () => {
    const dummyMovie = { title: 'Movie 1', language: 'en', release_date: '2022-01-01' };

    service.getMovieById('1').subscribe(movie => {
      expect(movie).toEqual(dummyMovie);
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyMovie);
  });

  it('should retrieve movie details', () => {
    const dummyDetail = { director: 'Director 1', cast: 'Actor 1, Actor 2' };

    service.getMovieDetails('1', '1').subscribe(detail => {
      expect(detail).toEqual(dummyDetail);
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/details/1/1`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyDetail);
  });

  it('should filter movies', () => {
    const criteria = { language: 'en' };
    const dummyMovies = [
      { title: 'Movie 1', language: 'en', release_date: '2022-01-01' }
    ];

    service.filterMovies(criteria).subscribe(movies => {
      expect(movies.length).toBe(1);
      expect(movies).toEqual(dummyMovies);
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/filter`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(criteria);
    req.flush(dummyMovies);
  });

  it('should sort movies', () => {
    const criteria = { sortBy: 'release_date', order: 'asc' };
    const dummyMovies = [
      { title: 'Movie 1', language: 'en', release_date: '2022-01-01' },
      { title: 'Movie 2', language: 'fr', release_date: '2022-02-01' }
    ];

    service.sortMovies(criteria).subscribe(movies => {
      expect(movies.length).toBe(2);
      expect(movies).toEqual(dummyMovies);
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/sort`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(criteria);
    req.flush(dummyMovies);
  });

  it('should aggregate movies', () => {
    const criteria = { field: 'language' };
    const dummyAggregation = [
      { language: 'en', count: 1 },
      { language: 'fr', count: 1 }
    ];

    service.aggregateMovies(criteria).subscribe(aggregation => {
      expect(aggregation.length).toBe(2);
      expect(aggregation).toEqual(dummyAggregation);
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/aggregate`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(criteria);
    req.flush(dummyAggregation);
  });

  it('should summarize movies', () => {
    const dummySummary = [
      { language: 'en', avgDuration: 120, totalMovies: 1 },
      { language: 'fr', avgDuration: 90, totalMovies: 1 }
    ];

    service.summarizeMovies().subscribe(summary => {
      expect(summary.length).toBe(2);
      expect(summary).toEqual(dummySummary);
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/summarize`);
    expect(req.request.method).toBe('GET');
    req.flush(dummySummary);
  });
});