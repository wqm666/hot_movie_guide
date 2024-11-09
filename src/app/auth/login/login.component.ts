import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      username: [''],
      password: ['']
    });
  }

  onSubmit(): void {
    this.authService.login(this.loginForm.value).subscribe(
      response => {
        console.log('Logged in successfully:', response);
        this.authService.setLoggedIn(true);
        this.router.navigate(['/movies']);
      },
      error => {
        console.error('Error logging in:', error);
      }
    );
  }
}
