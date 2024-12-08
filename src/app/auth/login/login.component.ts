import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

/**
 * Component for handling user login.
 * Provides a form for users to enter their credentials and handles login logic.
 * @since v1.0.0
 * @author Zirun Wang
 */
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  /**
   * The form group for the login form.
   * Contains fields for username and password.
   * Initialized with empty values.
   * @type {FormGroup}
   */
  loginForm: FormGroup;

  /**
   * The form builder service to create forms.
   * @type {FormBuilder}
   * @private
   */
  private fb: FormBuilder;

  /**
   * The authentication service used for logging in users.
   * @type {AuthService}
   * @private
   */
  private authService: AuthService;

  /**
   * The router service used for navigation after successful login.
   * @type {Router}
   * @private
   */
  private router: Router;

  /**
   * Initializes the login component with required services.
   * @constructor
   * @param {FormBuilder} fb - The form builder service to create forms.
   * @param {AuthService} authService - The authentication service used for logging in.
   * @param {Router} router - The router service used for navigation.
   */
  constructor(fb: FormBuilder, authService: AuthService, router: Router) {
    this.fb = fb;
    this.authService = authService;
    this.router = router;

    this.loginForm = this.fb.group({
      username: [''],
      password: ['']
    });
  }

  /**
   * Submits the login form.
   * Sends the form data to the authentication service to log in the user.
   * Navigates to the home page upon successful login.
   * Displays appropriate alerts for success or failure.
   * @returns {void}
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