import { ChangeDetectorRef, Component, inject, Input } from '@angular/core';
import { Movie } from '../../models/movie.model';
import { Router, RouterLink } from '@angular/router';
import { MovieService } from '../../services/movie.services';

@Component({
  selector: 'app-movie-banner',
  imports: [RouterLink],
  templateUrl: './movie-banner.html',
  styleUrl: './movie-banner.css',
})
export class MovieBanner {
  @Input() movie: Movie | null = null;

  cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
  movieService = inject(MovieService);
  router = inject(Router);

  isFading = false;
  errorMessage = '';

  toggleWatchlist(): void {
    if (!this.movie) return;

    if (!this.movieService.isLoggedIn()) {
      this.router.navigate(['/sign-in']);
      return;
    }

    this.movieService.toggleWishlist(this.movie.id).subscribe({
      next: (res) => {
        const added = res.status === 'added';
        this.movie!.inWatchlist = added;
        this.errorMessage = '';
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Failed to update watchlist. Please try again.';
        this.cdr.detectChanges();
      },
    });
  }
}
