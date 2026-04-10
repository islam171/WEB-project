import { Routes } from '@angular/router';
import { HomeComponent } from './home-component/home-component';

export const routes: Routes = [
  { path: '', component: HomeComponent },

  // Позже мы добавим сюда другие маршруты, например:
  // { path: 'login', component: LoginComponent },
  // { path: 'movies/:id', component: MovieDetailsComponent }
];
