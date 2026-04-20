import { ChangeDetectorRef, Component, inject, OnInit, signal } from '@angular/core';
import { SearchInput } from '../../components/search-input/search-input';
import { Movie } from '../../models/movie.model';
import { MovieService } from '../../services/movie.services';
import { MovieList } from '../../components/movie-list/movie-list';
import { debounceTime, distinctUntilChanged, startWith, Subject, switchMap, tap } from 'rxjs';
import { ActivatedRoute, isActive, Router } from '@angular/router';
import { AsyncPipe, NgClass } from '@angular/common';
import { IOrder } from '../../models/order.model';
import { GenreService } from '../../services/genre.service';
import { GenreList } from '../../components/genre-list/genre-list';
import { Sort } from '../../components/sort/sort';

@Component({
  selector: 'app-catalog',
  imports: [SearchInput, MovieList, NgClass, AsyncPipe, GenreList, Sort],
  templateUrl: './catalog.html',
  styleUrl: './catalog.css',
})
export class Catalog implements OnInit {
  private movieService = inject(MovieService);
  private cdr = inject(ChangeDetectorRef);
  private searchSubject = new Subject<string>();
  router = inject(Router);
  route = inject(ActivatedRoute);

  movies: Movie[] = [];
  loading: boolean = true;
  error: string = '';

  ngOnInit() {
    this.searchSubject.pipe(startWith(''), debounceTime(500), distinctUntilChanged()).subscribe({
      next: (text: string) => {
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: { search: text },
          queryParamsHandling: 'merge',
        });
      },
    });

    this.route.queryParams
      .pipe(
        debounceTime(500),
        switchMap((params) => {
          return this.movieService.getMoviesFilter(params);
        }),
      )
      .subscribe({
        next: (data: Movie[]) => {
          this.movies = data;
          this.cdr.markForCheck();
          this.loading = false;
        },
        error: (error) => {
          this.error = error;
          this.cdr.markForCheck();
          this.loading = false;
        },
      });
  }

  onSearch(text: string) {
    this.searchSubject.next(text);
  }
}
