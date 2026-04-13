import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { MovieDetailsComponent } from './pages/movie-details/movie-details.component';
import { About } from './pages/about/about';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'movies/:id', component: MovieDetailsComponent },
  { path: 'about' , component: About}
];
