import { ApplicationConfig, ErrorHandler, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { GlobalErrorHandler } from './core/services/global-error-handler.service';
import { httpInterceptor } from './core/interceptors/http.interceptor';
import { ClientService } from './services/client.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([httpInterceptor])
    ),
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandler
    },
    ClientService
  ]
};
