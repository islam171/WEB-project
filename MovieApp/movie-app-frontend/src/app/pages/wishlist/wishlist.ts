import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Movie } from '../../models/movie.model';
import { MovieService } from '../../services/movie.services';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-wishlist',
  imports: [AsyncPipe, RouterLink],
  templateUrl: './wishlist.html',
  styleUrl: './wishlist.css',
})
export class WishlistComponent implements OnInit {
  movies: Movie[] = [];
  loading = true;

  constructor(public movieService: MovieService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.movieService.getWishlist().subscribe({
      next: (w) => {
        this.movies = w.movies;
        this.loading = false;
        this.cdr.detectChanges();  
      },
      error: (err) => {
        console.log(err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  remove(movieId: number) {
    this.movieService.toggleWishlist(movieId).subscribe(() => {
      this.movies = this.movies.filter(m => m.id !== movieId);
      this.cdr.detectChanges();
    });
  }
}