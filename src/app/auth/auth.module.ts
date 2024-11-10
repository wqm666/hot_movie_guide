import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms'; // 确保导入 ReactiveFormsModule
import { AuthRoutingModule } from './auth-routing.module';
import { RouterModule } from '@angular/router'; // 确保导入 RouterModule

import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AuthService } from '../services/auth.service';
import { AuthGuard } from './guard/auth.guard';

@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule, // 确保导入 ReactiveFormsModule
    AuthRoutingModule,
    RouterModule // 确保导入 RouterModule
  ],
  providers: [AuthService, AuthGuard]
})
export class AuthModule { }