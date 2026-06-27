import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";

import {JwtInterceptor} from "@app/interceptors/jwt/jwt-interceptor";
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay, withNoHttpTransferCache } from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes, withComponentInputBinding()), provideClientHydration(withEventReplay()),
    provideHttpClient(
      withInterceptorsFromDi(),
    ),
    provideClientHydration(
      withNoHttpTransferCache()
    ),
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
  ]
};