import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component'; // 导入 HomeComponent

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'home', component: HomeComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' }  // 默认路径重定向到登录
];

@NgModule({
  imports: [RouterModule.forChild(routes)], // 使用 RouterModule.forChild
  exports: [RouterModule]
})
export class AuthRoutingModule { }
