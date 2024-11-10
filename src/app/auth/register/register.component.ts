import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.registerForm = this.fb.group({
      username: [''],
      password: [''],
      email: ['']
    });
  }

  onSubmit(): void {
    this.authService.register(this.registerForm.value).subscribe(
      response => {
        console.log('User registered successfully:', response);
        this.router.navigate(['/login']);
      },
      error => {
        console.error('Error registering user:', error);
      }
    );
  }
}
