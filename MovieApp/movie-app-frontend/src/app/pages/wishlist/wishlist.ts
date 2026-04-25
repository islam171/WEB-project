import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Movie } from '../../models/movie.model';
import { MovieService } from '../../services/movie.services';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-wishlist',
  imports: [RouterLink],
  templateUrl: './wishlist.html',
  styleUrl: './wishlist.css',
})
export class WishlistComponent implements OnInit {
  movies: Movie[] = [];
  loading = true;
  errorMessage = '';

  constructor(
    public movieService: MovieService,
    private cdr: ChangeDetectorRef,
    private router: Router,
  ) {}

  ngOnInit() {
    if (!this.movieService.isLoggedIn()) {
      this.router.navigate(['/sign-in']);
      return;
    }

    this.movieService.getWishlist().subscribe({
      next: (w) => {
        this.movies = w.movies;
        this.loading = false;
        this.errorMessage = '';
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Failed to load your watchlist. Please try again later.';
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  remove(movieId: number) {
    this.movieService.toggleWishlist(movieId).subscribe({
      next: () => {
        this.movies = this.movies.filter((m) => m.id !== movieId);
        this.errorMessage = '';
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Failed to update your watchlist. Please try again.';
        this.cdr.detectChanges();
      },
    });
  }
}
