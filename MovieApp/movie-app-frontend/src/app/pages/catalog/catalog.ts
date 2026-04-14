import { ChangeDetectorRef, Component, inject, OnInit, signal } from '@angular/core';
import { SearchInput } from '../../components/search-input/search-input';
import { SectionTitle } from '../../components/section-title/section-title';
import { Movie } from '../../models/movie.model';
import { MovieService } from '../../services/movie.services';
import { MovieList } from '../../components/movie-list/movie-list';
import { debounceTime, distinctUntilChanged, startWith, Subject, switchMap, tap } from 'rxjs';
import { ActivatedRoute, isActive, Router } from '@angular/router';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-catalog',
  imports: [SearchInput, MovieList, NgClass],
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

  searchQuery: string = '';
  currentOrder: string = '';

  constructor() {
    this.route.queryParams.subscribe((params) => {
      const searchParams: string = params['search'] || '';
      const order = params['order'];
      if (params['search']) {
        this.searchQuery = params['search'];
      } else {
        this.loadData();
        this.searchQuery = '';
      }

      if(params['order']){
        this.currentOrder = params['order'];
      }else{
        this.currentOrder = '';
      }
    });

    this.route.queryParams
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        switchMap((params) => {
          console.log(params);
          return this.movieService.getMovies();
        }),
      )
      .subscribe((data) => (this.movies = data));
  }

  ngOnInit() {
    // this.loadData();
    this.searchSubject.pipe(startWith(''), debounceTime(1000), distinctUntilChanged()).subscribe({
      next: (text: string) => {
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: { search: text },
          queryParamsHandling: "merge",
        });
      },
    });
  }

  loadData() {
    this.loading = true;
    this.movieService.getMovies().subscribe({
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

  // order
  protected SortBarIsOpen = false;

  showSort(){
    this.SortBarIsOpen = !this.SortBarIsOpen;
  }

  order = signal('Name')
  selectOrder(value: string) {
    this.order.set(value);
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { order: value },
      queryParamsHandling: "merge",
    })

    this.SortBarIsOpen = false;
  }
}
