import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AuthRoutingModule } from './auth-routing.module';
import { RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { DetailsComponent } from './details/details.component';
import { FavoritesComponent } from './favorites/favorites.component';
import { UserInfoComponent } from './user-info/user-info.component';
import { QueryComponent } from './query/query.component';
import { AuthService } from '../services/auth.service';
import { AuthGuard } from './guard/auth.guard';

@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    DetailsComponent,
    FavoritesComponent, // 确保声明 FavoritesComponent
    UserInfoComponent,
    QueryComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    AuthRoutingModule,
    RouterModule
  ],
  providers: [AuthService, AuthGuard]
})
export class AuthModule { }
