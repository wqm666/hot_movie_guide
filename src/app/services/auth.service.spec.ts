import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should register a user', () => {
    const dummyUser = { username: 'testuser', email: 'test@example.com', password: 'password' };
    const dummyResponse = { success: true };

    service.register(dummyUser).subscribe(response => {
      expect(response).toEqual(dummyResponse);
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/register`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(dummyUser);
    req.flush(dummyResponse);
  });

  it('should login a user', () => {
    const dummyCredentials = { username: 'testuser', password: 'password' };
    const dummyResponse = { success: true, token: '12345' };

    service.login(dummyCredentials).subscribe(response => {
      expect(response).toEqual(dummyResponse);
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/login`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(dummyCredentials);
    req.flush(dummyResponse);
  });

  it('should get user info', () => {
    const dummyUserInfo = { username: 'testuser', email: 'test@example.com' };

    service.getUserInfo().subscribe(userInfo => {
      expect(userInfo).toEqual(dummyUserInfo);
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/user`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyUserInfo);
  });

  it('should update user info', () => {
    const dummyUserInfo = { username: 'testuser', email: 'test@example.com' };
    const dummyResponse = { success: true };

    spyOn(service as any, 'getToken').and.returnValue('12345');

    service.updateUserInfo(dummyUserInfo).subscribe(response => {
      expect(response).toEqual(dummyResponse);
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/update`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(dummyUserInfo);
    expect(req.request.headers.get('x-access-token')).toBe('12345');
    req.flush(dummyResponse);
  });

  it('should logout a user', () => {
    const dummyResponse = { success: true };

    spyOn(service as any, 'getToken').and.returnValue('12345');

    service.logout().subscribe(response => {
      expect(response).toEqual(dummyResponse);
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/logout`);
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('x-access-token')).toBe('12345');
    req.flush(dummyResponse);
  });

  it('should delete a user', () => {
    const dummyResponse = { success: true };

    spyOn(service as any, 'getToken').and.returnValue('12345');

    service.deleteUser().subscribe(response => {
      expect(response).toEqual(dummyResponse);
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/delete_user`);
    expect(req.request.method).toBe('DELETE');
    expect(req.request.headers.get('x-access-token')).toBe('12345');
    req.flush(dummyResponse);
  });

  it('should check if the user is logged in', () => {
    spyOn(sessionStorage, 'getItem').and.returnValue('12345');
    expect(service.isLoggedIn()).toBe(true);
    (sessionStorage.getItem as jasmine.Spy).and.returnValue(null);
    expect(service.isLoggedIn()).toBe(false);
  });
});