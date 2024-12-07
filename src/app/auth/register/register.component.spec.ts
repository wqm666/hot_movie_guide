import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { AuthService } from '../../services/auth.service';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authService: AuthService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule, ReactiveFormsModule],
      declarations: [RegisterComponent],
      providers: [AuthService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form', () => {
    expect(component.registerForm).toBeDefined();
    expect(component.registerForm.get('username')).toBeDefined();
    expect(component.registerForm.get('password')).toBeDefined();
    expect(component.registerForm.get('email')).toBeDefined();
  });

  it('should register successfully', () => {
    const registerResponse = { message: 'User registered successfully' };
    spyOn(authService, 'register').and.returnValue(of(registerResponse));
    spyOn(router, 'navigate');
    spyOn(window, 'alert');

    component.registerForm.setValue({ username: 'testuser', password: 'password', email: 'test@example.com' });
    component.onSubmit();

    expect(authService.register).toHaveBeenCalledWith({ username: 'testuser', password: 'password', email: 'test@example.com' });
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
    expect(window.alert).toHaveBeenCalledWith('Register successfully');
  });

  it('should handle registration failure', () => {
    const errorResponse = { status: 400, message: 'Registration failed' };
    spyOn(authService, 'register').and.returnValue(throwError(errorResponse));
    spyOn(window, 'alert');

    component.registerForm.setValue({ username: 'testuser', password: 'password', email: 'test@example.com' });
    component.onSubmit();

    expect(authService.register).toHaveBeenCalledWith({ username: 'testuser', password: 'password', email: 'test@example.com' });
    expect(window.alert).toHaveBeenCalledWith('Register failed');
  });
});