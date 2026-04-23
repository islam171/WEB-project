import { Component, Input, OnChanges, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Movie } from '../../models/movie.model';
import { MovieService } from '../../services/movie.services';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-top-ten-movies',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './top-ten-movies.html',
  styleUrls: ['./top-ten-movies.css'],
})
export class TopTenMoviesComponent implements OnChanges, OnInit, OnDestroy {
  @Input() allMovies: Movie[] = [];
  topTen: Movie[] = [];

  private movieService = inject(MovieService);
  private router = inject(Router);
  private wishlistSubscription?: Subscription;

  ngOnInit(): void {
    this.wishlistSubscription = this.movieService.wishlistIds.subscribe((ids) => {
      this.topTen = this.topTen.map((movie) => {
        const inWishlist = ids.has(movie.id);
        return {
          ...movie,
          inWatchlist: inWishlist,
          in_wishlist: inWishlist,
        };
      });
    });
  }

  ngOnChanges(): void {
    if (this.allMovies && this.allMovies.length > 0) {
      this.topTen = this.allMovies.slice(0, 10).map((movie) => ({
        ...movie,
        inWatchlist: movie.inWatchlist ?? movie.in_wishlist ?? false,
        in_wishlist: movie.in_wishlist ?? movie.inWatchlist ?? false,
      }));
    }
  }

  ngOnDestroy(): void {
    this.wishlistSubscription?.unsubscribe();
  }

  toggleWatchlist(movie: Movie, event: Event): void {
    event.stopPropagation();
    event.preventDefault();

    if (!this.movieService.isLoggedIn()) {
      this.router.navigate(['/sign-in']);
      return;
    }

    this.movieService.toggleWishlist(movie.id).subscribe({
      next: (res) => {
        const added = res.status === 'added';
        movie.inWatchlist = added;
        movie.in_wishlist = added;
      },
      error: (err) => console.error('Wishlist toggle error:', err),
    });
  }

  openTrailer(movie: Movie, event: Event): void {
    event.stopPropagation();
    event.preventDefault();
    alert('РўСѓС‚ Р±СѓРґРµС‚ Р·Р°РїСѓСЃРєР°С‚СЊСЃСЏ С‚СЂРµР№Р»РµСЂ РґР»СЏ: ' + movie.title);
  }
}
