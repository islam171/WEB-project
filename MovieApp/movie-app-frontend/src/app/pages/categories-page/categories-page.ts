import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { MovieBanner } from '../../components/movie-banner/movie-banner';
import { Slider } from '../../components/actor-slider/slider';
import { Movie } from '../../models/movie.model';
import { MovieService } from '../../services/movie.services';
import { IGenre } from '../../models/genre.model';
import { GenreService } from '../../services/genre.service';
import { AsyncPipe } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { MovieGenre } from '../../models/movieGenre.model';

@Component({
  selector: 'app-categories-page',
  imports: [MovieBanner, Slider],
  templateUrl: './categories-page.html',
  styleUrl: './categories-page.css',
})
export class CategoriesPage implements OnInit {
  popularMovies: Movie[] = [];
  movieService: MovieService = inject(MovieService);
  genreService: GenreService = inject(GenreService);
  cdr = inject(ChangeDetectorRef);

  genres$ = this.genreService.genres$;
  loading = true;
  error = null;

  MoviesGenre: MovieGenre[] = [];

  ngOnInit(): void {
    this.movieService.getMovies().subscribe({
      next: (data: Movie[]) => {
        this.popularMovies = data;

        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Ошибка при загрузке фильмов:', err);
      },
    });

    this.genreService.getAll();

    this.genreService.getGenresWithMovies().subscribe({
      next: (movieGenres: MovieGenre[]) => {
        this.MoviesGenre = movieGenres;
        this.loading = false;
      },
      error: (err) => {
        this.error = err;
        this.loading = false;
      }
    })
  }
}
