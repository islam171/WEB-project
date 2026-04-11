import { Component } from '@angular/core';
// Импортируем наш новый отдельный блок
import { PopularMoviesComponent } from '../../components/popular-movies-slader/popular-movies-slader';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [PopularMoviesComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {

}
