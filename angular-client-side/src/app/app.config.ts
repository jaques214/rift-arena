import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import {
  type ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import {
  provideClientHydration,
  withEventReplay,
  withNoHttpTransferCache,
} from '@angular/platform-browser';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { jwtInterceptor } from '@app/interceptors/jwt/jwt-interceptor';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes, withComponentInputBinding()),
    provideClientHydration(withEventReplay()),
    provideHttpClient(withFetch(), withInterceptors([jwtInterceptor])),
    provideClientHydration(withNoHttpTransferCache()),
  ],
};
