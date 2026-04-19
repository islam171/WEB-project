import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { MovieDetailsComponent } from './pages/movie-details/movie-details.component';
import { About } from './pages/about/about';
import { Catalog } from './pages/catalog/catalog';
import { Signup } from './pages/signup/signup';
import { SignIn } from './pages/sign-in/sign-in';
import { WishlistComponent } from './pages/wishlist/wishlist';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'movies/:id', component: MovieDetailsComponent },
  { path: 'about' , component: About},
  { path: 'catalog' , component: Catalog},
  { path: 'sign-up' , component: Signup},
  { path: 'sign-in', component: SignIn},
  { path: 'wishlist', component:WishlistComponent}
];
