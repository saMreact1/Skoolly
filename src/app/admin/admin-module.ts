import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminRoutingModule } from './admin-routing-module';

// Components
import { Admin } from './admin';

// Material Modules
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from '../core/interceptors/auth.interceptor';


@NgModule({
  declarations: [
    Admin,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    RouterModule,
    MatSidenavModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    MatMenuTrigger,
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
})
export class AdminModule { }
