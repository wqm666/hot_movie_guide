import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AdminService } from './admin.service';

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

  it('should retrieve all users', () => {
    const dummyUsers = [
      { username: 'user1', email: 'user1@example.com' },
      { username: 'user2', email: 'user2@example.com' }
    ];

    spyOn(service as any, 'getToken').and.returnValue('12345');

    service.getAllUsers().subscribe(users => {
      expect(users.length).toBe(2);
      expect(users).toEqual(dummyUsers);
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/all_users`);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('x-access-token')).toBe('12345');
    req.flush(dummyUsers);
  });

  it('should retrieve all admin users', () => {
    const dummyAdminUsers = [
      { username: 'admin1', email: 'admin1@example.com' },
      { username: 'admin2', email: 'admin2@example.com' }
    ];

    spyOn(service as any, 'getToken').and.returnValue('12345');

    service.getAdminUsers().subscribe(adminUsers => {
      expect(adminUsers.length).toBe(2);
      expect(adminUsers).toEqual(dummyAdminUsers);
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/admin_users`);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('x-access-token')).toBe('12345');
    req.flush(dummyAdminUsers);
  });

  it('should toggle admin status', () => {
    const dummyResponse = { success: true };
    const userId = 'user1';

    spyOn(service as any, 'getToken').and.returnValue('12345');

    service.toggleAdmin(userId).subscribe(response => {
      expect(response).toEqual(dummyResponse);
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/toggle_admin`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ user_id: userId });
    expect(req.request.headers.get('x-access-token')).toBe('12345');
    req.flush(dummyResponse);
  });

  it('should add a new movie', () => {
    const dummyMovie = { title: 'Movie 1', language: 'en', release_date: '2022-01-01' };
    const dummyResponse = { success: true };

    spyOn(service as any, 'getToken').and.returnValue('12345');

    service.addMovie(dummyMovie).subscribe(response => {
      expect(response).toEqual(dummyResponse);
    });

    const req = httpMock.expectOne('http://127.0.0.1:5000/movies/');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(dummyMovie);
    expect(req.request.headers.get('x-access-token')).toBe('12345');
    req.flush(dummyResponse);
  });

  it('should update a movie', () => {
    const movieId = '1';
    const dummyMovie = { title: 'Movie 1', language: 'en', release_date: '2022-01-01' };
    const dummyResponse = { success: true };

    spyOn(service as any, 'getToken').and.returnValue('12345');

    service.updateMovie(movieId, dummyMovie).subscribe(response => {
      expect(response).toEqual(dummyResponse);
    });

    const req = httpMock.expectOne(`http://127.0.0.1:5000/movies/${movieId}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(dummyMovie);
    expect(req.request.headers.get('x-access-token')).toBe('12345');
    req.flush(dummyResponse);
  });

  it('should delete a movie', () => {
    const movieId = '1';
    const dummyResponse = { success: true };

    spyOn(service as any, 'getToken').and.returnValue('12345');

    service.deleteMovie(movieId).subscribe(response => {
      expect(response).toEqual(dummyResponse);
    });

    const req = httpMock.expectOne(`http://127.0.0.1:5000/movies/${movieId}`);
    expect(req.request.method).toBe('DELETE');
    expect(req.request.headers.get('x-access-token')).toBe('12345');
    req.flush(dummyResponse);
  });
});