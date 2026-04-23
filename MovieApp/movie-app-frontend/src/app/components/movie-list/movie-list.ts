import { Component, Input, OnInit } from '@angular/core';
import { Movie } from '../../models/movie.model';
import { Router, RouterLink } from '@angular/router';
import { MovieService } from '../../services/movie.services';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-movie-list',
  imports: [RouterLink, AsyncPipe],
  templateUrl: './movie-list.html',
  styleUrl: './movie-list.css',
})
export class MovieList implements OnInit {
  @Input() movies: Movie[] = [];
  wishlistIds$: Observable<Set<number>>;

  constructor(
    public movieService: MovieService,
    private router: Router,
  ) {
    this.wishlistIds$ = this.movieService.wishlistIds;
  }

  ngOnInit() {
    if (this.movieService.isLoggedIn()) {
      this.movieService.getWishlist().subscribe();
    }
  }

  toggleWishlist(event: Event, movieId: number) {
    event.stopPropagation();

    if (!this.movieService.isLoggedIn()) {
      this.router.navigate(['/sign-in']);
      return;
    }

    this.movieService.toggleWishlist(movieId).subscribe();
  }
}
