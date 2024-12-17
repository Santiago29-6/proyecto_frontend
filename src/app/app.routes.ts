import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { LoginComponent } from './features/auth/login/login.component';
import { PersonaComponent } from './features/dashboard/persona/persona.component';
import { AuthGuard } from './core/guards/auth.guard';
import { ProfileComponent } from './features/dashboard/users/profile/profile.component';
import { SignupComponent } from './features/auth/signup/signup.component';
import { CreateComponent } from './features/dashboard/users/create/create.component';
import { BrandComponent } from './features/dashboard/brand/brand.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'sign-up', component: SignupComponent },
  { path: 'personas', component: PersonaComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'users', component: CreateComponent, canActivate: [AuthGuard] },
  { path: 'brand', component: BrandComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
