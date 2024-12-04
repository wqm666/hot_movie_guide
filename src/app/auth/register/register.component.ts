import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

/**
 * Component for handling user registration.
 * Provides a form for users to enter their registration details and handles registration logic.
 * @since v1.0.0
 * @autor Zirun Wang
 */
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  /**
   * The form group for the registration form.
   * @type { FormGroup }
   */
  registerForm: FormGroup;

  /**
   * @constructor
   * @param { FormBuilder } fb - The form builder service to create forms.
   * @param { AuthService } authService - The authentication service used for registering.
   * @param { Router } router - The router service used for navigation.
   */
  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.registerForm = this.fb.group({
      username: [''],
      password: [''],
      email: ['']
    });
  }

  /**
   * Submits the registration form.
   * Calls the authentication service to register the user and handles the response.
   * @since v1.0.0
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