import { Component, Input, OnChanges } from '@angular/core';
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
  @Input() allMovies: Movie[] = [];
  topTen: Movie[] = [];

  ngOnChanges(): void {
    if (this.allMovies && this.allMovies.length > 0) {
      this.topTen = this.allMovies.slice(0, 10).map((movie) => ({
        ...movie,
        inWatchlist: movie.inWatchlist ?? movie.in_wishlist ?? false,
        in_wishlist: movie.in_wishlist ?? movie.inWatchlist ?? false,
      }));
    }
  }

  toggleWatchlist(movie: Movie, event: Event): void {
    event.stopPropagation();
    event.preventDefault();

    const current = movie.inWatchlist ?? movie.in_wishlist ?? false;
    movie.inWatchlist = !current;
    movie.in_wishlist = !current;
  }

  openTrailer(movie: Movie, event: Event): void {
    event.stopPropagation();
    event.preventDefault();
    alert('Тут будет запускаться трейлер для: ' + movie.title);
  }
}
