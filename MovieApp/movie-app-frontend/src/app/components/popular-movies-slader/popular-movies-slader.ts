import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Movie } from '../../models/movie.model';
import { MovieService } from '../../services/movie.services';

@Component({
  selector: 'app-popular-movies',
  standalone: true,
  templateUrl: './popular-movies-slader.html',
  styleUrls: ['./popular-movies-slader.css'],
})

export class PopularMoviesComponent implements OnInit {
  popularMovies: Movie[] = [];
  currentMovieIndex = 0;
  currentMovie: Movie | null = null;
  isLoading = true;

  isFading: boolean = false;

  constructor(
    private movieService: MovieService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.movieService.getMovies().subscribe({
      next: (data: Movie[]) => {
        this.popularMovies = data;
        if (this.popularMovies.length > 0) {
          this.updateCurrentMovie();
        }
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Ошибка API:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
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
    if (this.currentMovie) {
      this.currentMovie.inWatchlist = !this.currentMovie.inWatchlist;
      this.cdr.detectChanges();
    }
  }
}
