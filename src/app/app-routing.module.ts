import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router'; // 确保导入 RouterModule
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)], // 使用 RouterModule.forRoot
  exports: [RouterModule]
})
export class AppRoutingModule { }
