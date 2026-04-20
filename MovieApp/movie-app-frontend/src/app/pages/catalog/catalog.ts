import { ChangeDetectorRef, Component, inject, OnInit, signal } from '@angular/core';
import { SearchInput } from '../../components/search-input/search-input';
import { Movie } from '../../models/movie.model';
import { MovieService } from '../../services/movie.services';
import { MovieList } from '../../components/movie-list/movie-list';
import { debounceTime, distinctUntilChanged, startWith, Subject, switchMap, tap } from 'rxjs';
import { ActivatedRoute, isActive, Router } from '@angular/router';
import { NgClass } from '@angular/common';
import {IOrder} from "../../models/order.model";

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


  ngOnInit() {
    this.searchSubject.pipe(startWith(''), debounceTime(500), distinctUntilChanged()).subscribe({
      next: (text: string) => {
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: { search: text },
          queryParamsHandling: "merge",
        });
      },
    });

      this.route.queryParams
          .pipe(
              debounceTime(500),
              switchMap((params) => {
                  return this.movieService.getMoviesFilter(params);
              })
          )
          .subscribe(
              {
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
              }
          );
  }


  onSearch(text: string) {
    this.searchSubject.next(text);
  }

  // order
  protected SortBarIsOpen = false;

  showSort(){
    this.SortBarIsOpen = !this.SortBarIsOpen;
  }

  orders: IOrder[] = [
      {
          id: 1,
          key: 'title',
          title: 'Name',
      },
      {
          id: 2,
          key: 'year',
          title: 'Year',
      },
      {
          id: 1,
          key: 'duration',
          title: 'Duration',
      },
  ]

  order = signal<IOrder>(this.orders[0])
  selectOrder(value: IOrder) {
    this.order.set(value);
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { ordering: value.key },
      queryParamsHandling: "merge",
    })

    this.SortBarIsOpen = false;
  }
}
