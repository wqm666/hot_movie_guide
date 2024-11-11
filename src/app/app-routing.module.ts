import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './auth/home/home.component';
import { DetailsComponent } from './auth/details/details.component';
import { FavoritesComponent } from './auth/favorites/favorites.component';
import { UserInfoComponent } from './auth/user-info/user-info.component';
import { QueryComponent } from './auth/query/query.component';
import { DeleteUserComponent } from './auth/delete-user/delete-user.component';
import { AuthGuard } from './auth/guard/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'details/:id', component: DetailsComponent, canActivate: [AuthGuard] },
  { path: 'favorites', component: FavoritesComponent, canActivate: [AuthGuard] },
  { path: 'user-info', component: UserInfoComponent, canActivate: [AuthGuard] },
  { path: 'query', component: QueryComponent, canActivate: [AuthGuard] },
  { path: 'delete-user', component: DeleteUserComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
