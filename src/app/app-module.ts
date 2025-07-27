import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing-module';
import { NgxTypedJsModule } from 'ngx-typed-js'
import { Auth } from './features/auth/auth/auth';

// Components
import { App } from './app';

// Material Modules
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    App,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgxTypedJsModule,
    MatButtonModule,
    MatIconModule,
    Auth,
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [App]
})
export class AppModule { }
