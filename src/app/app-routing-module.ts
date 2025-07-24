import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './features/home';
import { Auth } from './features/auth/auth/auth';
import { ForgotPassword } from './features/auth/forgot-password/forgot-password';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'auth', component: Auth },
  { path: 'forgot-password', component: ForgotPassword }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
