import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AdminService } from './admin.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

describe('AdminService', () => {
  let service: AdminService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AdminService]
    });
    service = TestBed.inject(AdminService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve all users', () => {
    const dummyUsers = [
      { username: 'John', email: 'john@example.com' },
      { username: 'Doe', email: 'doe@example.com' }
    ];

    service.getAllUsers().subscribe(users => {
      expect(users.length).toBe(2);
      expect(users).toEqual(dummyUsers);
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/all_users`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyUsers);
  });

  it('should retrieve all admin users', () => {
    const dummyAdminUsers = [
      { username: 'Admin1', email: 'admin1@example.com' },
      { username: 'Admin2', email: 'admin2@example.com' }
    ];

    service.getAdminUsers().subscribe(adminUsers => {
      expect(adminUsers.length).toBe(2);
      expect(adminUsers).toEqual(dummyAdminUsers);
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/admin_users`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyAdminUsers);
  });

  it('should toggle admin status', () => {
    const user_id = '12345';
    const response = { message: 'Admin status toggled' };

    service.toggleAdmin(user_id).subscribe(res => {
      expect(res).toEqual(response);
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/toggle_admin`);
    expect(req.request.method).toBe('POST');
    req.flush(response);
  });

  it('should add a new movie', () => {
    const newMovie = { title: 'New Movie', director: 'Director' };
    const response = { message: 'Movie added' };

    service.addMovie(newMovie).subscribe(res => {
      expect(res).toEqual(response);
    });

    const req = httpMock.expectOne('http://127.0.0.1:5000/movies/');
    expect(req.request.method).toBe('POST');
    req.flush(response);
  });

  it('should update an existing movie', () => {
    const movie_id = '123';
    const updatedMovie = { title: 'Updated Movie', director: 'New Director' };
    const response = { message: 'Movie updated' };

    service.updateMovie(movie_id, updatedMovie).subscribe(res => {
      expect(res).toEqual(response);
    });

    const req = httpMock.expectOne(`http://127.0.0.1:5000/movies/${movie_id}`);
    expect(req.request.method).toBe('PUT');
    req.flush(response);
  });

  it('should delete a movie', () => {
    const movie_id = '123';
    const response = { message: 'Movie deleted' };

    service.deleteMovie(movie_id).subscribe(res => {
      expect(res).toEqual(response);
    });

    const req = httpMock.expectOne(`http://127.0.0.1:5000/movies/${movie_id}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(response);
  });

  it('should get token from session storage', () => {
    const token = '12345';
    spyOn(sessionStorage, 'getItem').and.returnValue(token);
    expect(service['getToken']()).toBe(token);
  });
});