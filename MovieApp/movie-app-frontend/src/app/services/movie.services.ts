import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { Movie, IReview } from '../models/movie.model';
import { Actor } from '../models/actor.model';

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  private apiUrl = 'http://localhost:8000/api/';
  private wishlistIds$ = new BehaviorSubject<Set<number>>(new Set());

  constructor(private http: HttpClient) {}

  getMovies(): Observable<Movie[]> {
    return this.http.get<Movie[]>(this.apiUrl + 'movies/').pipe(
      tap((movies) => {
        const ids = new Set<number>();
        movies.forEach((movie) => {
          if (movie.in_wishlist || movie.inWatchlist) {
            ids.add(movie.id);
          }
        });
        this.wishlistIds$.next(ids);
      }),
    );
  }

  getAllActors(): Observable<Actor[]> {
    return this.http.get<Actor[]>(this.apiUrl + 'actors/');
  }

  getMovieById(id: number): Observable<Movie> {
    return this.http.get<Movie>(this.apiUrl + 'movies/' + id + '/');
  }

  getMoviesFilter(params: any): Observable<Movie[]> {
    return this.http.get<Movie[]>(this.apiUrl + 'movies/', { params }).pipe(
      tap((movies) => {
        const ids = new Set<number>();
        movies.forEach((movie) => {
          if (movie.in_wishlist || movie.inWatchlist) {
            ids.add(movie.id);
          }
        });
        this.wishlistIds$.next(ids);
      }),
    );
  }

  getWishlist(): Observable<{ id: number; movies: Movie[] }> {
    return this.http
      .get<{ id: number; movies: Movie[] }>(this.apiUrl + 'wishlist/')
      .pipe(tap((w) => this.wishlistIds$.next(new Set(w.movies.map((m: Movie) => m.id)))));
  }

  get wishlistIds() {
    return this.wishlistIds$.asObservable();
  }

  toggleWishlist(movieId: number): Observable<any> {
    return this.http.post<any>(this.apiUrl + 'wishlist/toggle/', { movie_id: movieId }).pipe(
      tap((res) => {
        const ids = new Set(this.wishlistIds$.value);
        if (res.status === 'added') {
          ids.add(movieId);
        } else {
          ids.delete(movieId);
        }
        this.wishlistIds$.next(ids);
      }),
    );
  }

  isInWishlist(movieId: number): boolean {
    return this.wishlistIds$.value.has(movieId);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getRecentWishlist(): Observable<Movie[]> {
    return this.http.get<Movie[]>(this.apiUrl + 'wishlist/recent/');
  }

  toggleMovieLike(movieId: number): Observable<any> {
    return this.http.post<any>(this.apiUrl + `movies/${movieId}/like/`, {});
  }

  getMovieReviews(movieId: number): Observable<IReview[]> {
    return this.http.get<IReview[]>(this.apiUrl + `movies/${movieId}/reviews/`);
  }

  addMovieReview(movieId: number, payload: { text: string; rating: number }): Observable<IReview> {
    return this.http.post<IReview>(this.apiUrl + `movies/${movieId}/reviews/`, payload);
  }

  deleteMovieReview(movieId: number | undefined): Observable<any> {
    return this.http.delete<any>(this.apiUrl + `movies/${movieId}/reviews/`);
  }
}
