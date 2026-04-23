import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { SectionTitle } from '../../components/section-title/section-title';
import { ReviewsList } from '../../components/reviews-list/reviews-list';
import { Rating } from '../../components/rating/rating';
import { Slider } from '../../components/slider/slider';

import { Movie, IReview } from '../../models/movie.model';
import { IGenre } from '../../models/genre.model';
import { MovieService } from '../../services/movie.services';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-movie-details-component',
  imports: [SectionTitle, ReviewsList, Rating, Slider, FormsModule],
  templateUrl: './movie-details.component.html',
  styleUrl: './movie-details.component.css',
})
export class MovieDetailsComponent {
  private activeRoute = inject(ActivatedRoute);
  private movieService = inject(MovieService);
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  movie: Movie | null = null;
  reviews: IReview[] = [];
  loading = true;
  error = '';
  reviewError = '';
  reviewSuccess = '';

  reviewForm = {
    text: '',
    rating: 10,
  };

  constructor() {
    this.activeRoute.params.subscribe((params) => {
      const id = +params['id'];
      this.loadData(id);
    });
  }

  private loadData(id: number) {
    this.loading = true;
    this.reviewError = '';
    this.reviewSuccess = '';

    this.movieService.getMovieById(id).subscribe({
      next: (data: Movie) => {
        this.movie = data;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.error = 'Failed to load movie';
        this.loading = false;
        this.cdr.markForCheck();
      },
    });

    this.movieService.getMovieReviews(id).subscribe({
      next: (reviews) => {
        this.reviews = reviews;
        this.cdr.markForCheck();
      },
      error: () => {
        this.reviews = [];
        this.cdr.markForCheck();
      },
    });
  }

  filterGenre(genre: IGenre) {
    this.router.navigate(['/catalog'], {
      relativeTo: this.route,
      queryParams: { genres: genre.id },
      queryParamsHandling: 'merge',
    });
  }

  toggleWishlist() {
    if (!this.movie) return;

    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/sign-in']);
      return;
    }

    this.movieService.toggleWishlist(this.movie.id).subscribe({
      next: (res) => {
        if (!this.movie) return;
        const added = res.status === 'added';
        this.movie.in_wishlist = added;
        this.cdr.markForCheck();
      },
      error: () => {
        this.error = 'Failed to update wishlist';
        this.cdr.markForCheck();
      },
    });
  }

  toggleMovieLike() {
    if (!this.movie) return;

    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/sign-in']);
      return;
    }

    this.movieService.toggleMovieLike(this.movie.id).subscribe({
      next: (res) => {
        if (!this.movie) return;

        const liked = res.status === 'liked';
        this.movie.is_liked = liked;
        this.movie.likes = liked ? this.movie.likes + 1 : Math.max(0, this.movie.likes - 1);

        this.cdr.markForCheck();
      },
      error: () => {
        this.error = 'Failed to update like';
        this.cdr.markForCheck();
      },
    });
  }

  submitReview() {
    if (!this.movie) return;

    this.reviewError = '';
    this.reviewSuccess = '';

    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/sign-in']);
      return;
    }

    this.movieService.addMovieReview(this.movie.id, this.reviewForm).subscribe({
      next: () => {
        this.reviewSuccess = 'Review saved successfully';
        this.reviewForm = { text: '', rating: 10 };
        this.loadData(this.movie!.id);
      },
      error: () => {
        this.reviewError = 'Failed to save review';
        this.cdr.markForCheck();
      },
    });
  }
}
