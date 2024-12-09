import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app-routing.module';

/**
 * Application configuration for the Angular app.
 * Provides zone change detection, router, and HTTP client.
 * @since v1.0.0
 * @author Zirun Wang
 */
export const appConfig: ApplicationConfig = {
  /**
   * Array of providers for the application.
   * @type { Array<Provider> }
   */
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient()
  ]
};