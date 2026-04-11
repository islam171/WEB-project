import { Routes } from '@angular/router';
import { HomeComponent } from './home-component/home-component';
import { MovieDetailsComponent } from './pages/movie-details-component/movie-details-component';

export const routes: Routes = [
  { path: '', component: HomeComponent },

  // Позже мы добавим сюда другие маршруты, например:
  // { path: 'login', component: LoginComponent },
  { path: 'movies/:id', component: MovieDetailsComponent }
];
