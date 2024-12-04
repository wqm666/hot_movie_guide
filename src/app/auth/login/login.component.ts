import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

/**
 * Component for handling user login.
 * Provides a form for users to enter their credentials and handles login logic.
 * @since v1.0.0
 * @autor Zirun Wang
 */
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  /**
   * The form group for the login form.
   * @type { FormGroup }
   */
  loginForm: FormGroup;

  /**
   * @constructor
   * @param { FormBuilder } fb - The form builder service to create forms.
   * @param { AuthService } authService - The authentication service used for logging in.
   * @param { Router } router - The router service used for navigation.
   */
  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      username: [''],
      password: ['']
    });
  }

  /**
   * Submits the login form.
   * Calls the authentication service to log in the user and handles the response.
   * @since v1.0.0
   */
  onSubmit(): void {
    this.authService.login(this.loginForm.value).subscribe(
      response => {
        console.log('Logged in successfully:', response);
        sessionStorage.setItem('token', response.token);
        this.router.navigate(['/home']);
        alert('Login successfully');
      },
      error => {
        console.error('Error logging in:', error);
        alert('Login failed');
      }
    );
  }
}