import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './features/home';
import { Auth } from './features/auth/auth/auth';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'auth', component: Auth }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
