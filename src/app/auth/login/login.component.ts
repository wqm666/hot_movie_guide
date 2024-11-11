import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
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
        sessionStorage.setItem('token', response.token); // 保存 token
        this.router.navigate(['/home']); // 导航到主页
      },
      error => {
        console.error('Error logging in:', error);
      }
    );
  }
}
