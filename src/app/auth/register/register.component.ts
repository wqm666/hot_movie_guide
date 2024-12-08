import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

/**
 * Component for handling user registration.
 * Provides a form for users to enter their registration details and handles registration logic.
 * @since v1.0.0
 * @author Zirun Wang
 */
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  /**
   * The form group for the registration form.
   * Contains fields for username, password, and email.
   * Initialized with empty values.
   * @type {FormGroup}
   */
  registerForm: FormGroup;

  /**
   * The form builder service to create forms.
   * @type {FormBuilder}
   * @private
   */
  private fb: FormBuilder;

  /**
   * The authentication service used for registering users.
   * @type {AuthService}
   * @private
   */
  private authService: AuthService;

  /**
   * The router service used for navigation after successful registration.
   * @type {Router}
   * @private
   */
  private router: Router;

  /**
   * Initializes the registration component with required services.
   * @constructor
   * @param {FormBuilder} fb - The form builder service to create forms.
   * @param {AuthService} authService - The authentication service used for registering.
   * @param {Router} router - The router service used for navigation.
   */
  constructor(fb: FormBuilder, authService: AuthService, router: Router) {
    this.fb = fb;
    this.authService = authService;
    this.router = router;

    this.registerForm = this.fb.group({
      username: [''],
      password: [''],
      email: ['']
    });
  }

  /**
   * Submits the registration form.
   * Sends the form data to the authentication service to register the user.
   * Navigates to the login page upon successful registration.
   * Displays appropriate alerts for success or failure.
   * @returns {void}
   */
  onSubmit(): void {
    this.authService.register(this.registerForm.value).subscribe(
      response => {
        console.log('User registered successfully:', response);
        this.router.navigate(['/login']);
        alert('Register successfully');
      },
      error => {
        console.error('Error registering user:', error);
        alert('Register failed');
      }
    );
  }
}