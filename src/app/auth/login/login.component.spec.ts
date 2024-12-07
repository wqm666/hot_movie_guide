import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth.service';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: AuthService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule, ReactiveFormsModule],
      declarations: [LoginComponent],
      providers: [AuthService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form', () => {
    expect(component.loginForm).toBeDefined();
    expect(component.loginForm.get('username')).toBeDefined();
    expect(component.loginForm.get('password')).toBeDefined();
  });

  it('should login successfully', () => {
    const loginResponse = { token: '12345' };
    spyOn(authService, 'login').and.returnValue(of(loginResponse));
    spyOn(router, 'navigate');

    component.loginForm.setValue({ username: 'testuser', password: 'password' });
    component.onSubmit();

    expect(authService.login).toHaveBeenCalledWith({ username: 'testuser', password: 'password' });
    expect(sessionStorage.getItem('token')).toBe('12345');
    expect(router.navigate).toHaveBeenCalledWith(['/home']);
  });

  it('should handle login failure', () => {
    const errorResponse = { status: 401, message: 'Unauthorized' };
    spyOn(authService, 'login').and.returnValue(throwError(errorResponse));
    spyOn(window, 'alert');

    component.loginForm.setValue({ username: 'testuser', password: 'wrongpassword' });
    component.onSubmit();

    expect(authService.login).toHaveBeenCalledWith({ username: 'testuser', password: 'wrongpassword' });
    expect(window.alert).toHaveBeenCalledWith('Login failed');
  });
});