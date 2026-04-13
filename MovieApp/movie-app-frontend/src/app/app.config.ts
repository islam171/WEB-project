import { ApplicationConfig, NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [provideBrowserGlobalErrorListeners(), provideRouter(routes)],
};

@NgModule({
  imports: [
    // ...
    HttpClientModule,
  ],
  // ...
})
export class AppModule {}
