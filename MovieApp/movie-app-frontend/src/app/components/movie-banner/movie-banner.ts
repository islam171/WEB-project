import { ChangeDetectorRef, Component, inject, Input } from '@angular/core';
import { Movie } from '../../models/movie.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-movie-banner',
  imports: [RouterLink],
  templateUrl: './movie-banner.html',
  styleUrl: './movie-banner.css',
})
export class MovieBanner {
  @Input() movie: Movie | null = null;
  cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
  isFading: boolean = false;

  toggleWatchlist(): void {
    if (this.movie) {
      this.movie.inWatchlist = !this.movie.inWatchlist;
      this.cdr.detectChanges();
    }
  }
}
