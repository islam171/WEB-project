import { Component, Input, OnChanges } from '@angular/core'; // Меняем OnInit на OnChanges
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Movie } from '../../models/movie.model';

@Component({
  selector: 'app-top-ten-movies',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './top-ten-movies.html',
  styleUrls: ['./top-ten-movies.css'],
})
export class TopTenMoviesComponent implements OnChanges {
  // Заменяем implements OnInit
  @Input() allMovies: Movie[] = [];
  topTen: Movie[] = [];

  // Этот метод сработает, когда придут данные из HomeComponent
  ngOnChanges(): void {
    if (this.allMovies && this.allMovies.length > 0) {
      this.topTen = this.allMovies.slice(0, 10);
    }
  }

  toggleWatchlist(movie: Movie, event: Event): void {
    event.stopPropagation();
    event.preventDefault();
    movie.inWatchlist = !movie.inWatchlist;
  }
}
