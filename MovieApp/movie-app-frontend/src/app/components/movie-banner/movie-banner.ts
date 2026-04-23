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
  isFading = false;

  toggleWatchlist(): void {
    if (!this.movie) return;

    const current = this.movie.inWatchlist ?? this.movie.in_wishlist ?? false;
    this.movie.inWatchlist = !current;
    this.movie.in_wishlist = !current;

    this.cdr.detectChanges();
  }
}
