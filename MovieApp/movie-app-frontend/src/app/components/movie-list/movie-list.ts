import { Component, Input, OnInit } from '@angular/core';
import { Movie } from '../../models/movie.model';
import { RouterLink } from '@angular/router';
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

  constructor(public movieService: MovieService) {
    this.wishlistIds$ = this.movieService.wishlistIds;
  }

  ngOnInit() {
    this.movieService.getWishlist().subscribe();
  }

  toggleWishlist(event: Event, movieId: number) {
    event.stopPropagation();
    this.movieService.toggleWishlist(movieId).subscribe();
  }
}