import { Component, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { Movie } from '../../models/movie.model';
import { MovieService } from '../../services/movie.services';
import { Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-popular-movies',
  standalone: true,
  templateUrl: './popular-movies-slader.html',
  styleUrls: ['./popular-movies-slader.css'],
  imports: [RouterLink],
})
export class PopularMoviesComponent implements OnInit, OnDestroy {
  popularMovies: Movie[] = [];
  currentMovieIndex = 0;
  currentMovie: Movie | null = null;
  isLoading = true;
  isFading = false;
  errorMessage = '';
  private wishlistSubscription?: Subscription;

  constructor(
    private movieService: MovieService,
    private cdr: ChangeDetectorRef,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.wishlistSubscription = this.movieService.wishlistIds.subscribe((ids) => {
      this.popularMovies = this.popularMovies.map((movie) => {
        const inWishlist = ids.has(movie.id);
        return {
          ...movie,
          inWatchlist: inWishlist,
          in_wishlist: inWishlist,
        };
      });

      if (this.currentMovie) {
        const inWishlist = ids.has(this.currentMovie.id);
        this.currentMovie = {
          ...this.currentMovie,
          inWatchlist: inWishlist,
          in_wishlist: inWishlist,
        };
      }

      this.cdr.detectChanges();
    });

    this.movieService.getMovies().subscribe({
      next: (data: Movie[]) => {
        this.popularMovies = data.map((movie) => ({
          ...movie,
          inWatchlist: movie.inWatchlist ?? movie.in_wishlist ?? false,
          in_wishlist: movie.in_wishlist ?? movie.inWatchlist ?? false,
        }));

        if (this.popularMovies.length > 0) {
          this.updateCurrentMovie();
        }

        this.errorMessage = '';
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Failed to load the banner movies. Please try again later.';
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  ngOnDestroy(): void {
    this.wishlistSubscription?.unsubscribe();
  }

  updateCurrentMovie(): void {
    this.currentMovie = this.popularMovies[this.currentMovieIndex];
  }

  nextMovie(): void {
    if (this.isFading) return;

    this.isFading = true;

    setTimeout(() => {
      if (this.popularMovies.length > 0) {
        this.currentMovieIndex = (this.currentMovieIndex + 1) % this.popularMovies.length;
        this.updateCurrentMovie();
        this.cdr.detectChanges();
      }

      this.isFading = false;
      this.cdr.detectChanges();
    }, 150);
  }

  prevMovie(): void {
    if (this.isFading) return;

    this.isFading = true;

    setTimeout(() => {
      if (this.popularMovies.length > 0) {
        this.currentMovieIndex =
          (this.currentMovieIndex - 1 + this.popularMovies.length) % this.popularMovies.length;
        this.updateCurrentMovie();
        this.cdr.detectChanges();
      }

      this.isFading = false;
      this.cdr.detectChanges();
    }, 150);
  }

  toggleWatchlist(): void {
    if (!this.currentMovie) return;

    if (!this.movieService.isLoggedIn()) {
      this.router.navigate(['/sign-in']);
      return;
    }

    this.movieService.toggleWishlist(this.currentMovie.id).subscribe({
      next: (res) => {
        const added = res.status === 'added';
        this.popularMovies = this.popularMovies.map((movie) =>
          movie.id === this.currentMovie!.id
            ? { ...movie, inWatchlist: added, in_wishlist: added }
            : movie,
        );
        this.currentMovie!.inWatchlist = added;
        this.currentMovie!.in_wishlist = added;
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
