import { Component } from '@angular/core';

import { PopularMoviesComponent } from '../../components/popular-movies-slader/popular-movies-slader';
import { PopularActorsSliderComponent } from '../../components/popular-actors-slider/popular-actors-slider';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [PopularMoviesComponent, PopularActorsSliderComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {}
