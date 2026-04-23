import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

import { Movie, IReview } from '../models/movie.model';
import { Actor } from '../models/actor.model';

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  private apiUrl = 'http://localhost:8000/api';
  private wishlistIds$ = new BehaviorSubject<Set<number>>(new Set());

  constructor(private http: HttpClient) {}

  getMovies(): Observable<Movie[]> {
    return this.http.get<Movie[]>(`${this.apiUrl}/movies/`);
  }

  getPopularActors(): Observable<Actor[]> {
    return this.http.get<Actor[]>(`${this.apiUrl}/actors/popular/`);
  }

  getAllActors(): Observable<Actor[]> {
    return this.http.get<Actor[]>(`${this.apiUrl}/actors/`);
  }

  getMovieById(id: number): Observable<Movie> {
    return this.http.get<Movie>(`${this.apiUrl}/movies/${id}/`);
  }

  getMoviesFilter(params: any): Observable<Movie[]> {
    return this.http.get<Movie[]>(`${this.apiUrl}/movies/`, { params });
  }

  getWishlist(): Observable<{ id: number; movies: Movie[] }> {
    return this.http.get<{ id: number; movies: Movie[] }>(`${this.apiUrl}/wishlist/`).pipe(
      tap((wishlist) => {
        this.wishlistIds$.next(new Set(wishlist.movies.map((m) => m.id)));
      }),
    );
  }

  get wishlistIds() {
    return this.wishlistIds$.asObservable();
  }

  toggleWishlist(movieId: number): Observable<{ status: string; movie_id: number }> {
    return this.http
      .post<{
        status: string;
        movie_id: number;
      }>(`${this.apiUrl}/wishlist/toggle/`, { movie_id: movieId })
      .pipe(
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

  getRecentWishlist(): Observable<Movie[]> {
    return this.http.get<Movie[]>(`${this.apiUrl}/wishlist/recent/`);
  }

  toggleMovieLike(movieId: number): Observable<{ status: string }> {
    return this.http.post<{ status: string }>(`${this.apiUrl}/movies/${movieId}/like/`, {});
  }

  toggleActorLike(actorId: number): Observable<{ status: string }> {
    return this.http.post<{ status: string }>(`${this.apiUrl}/actors/${actorId}/like/`, {});
  }

  getMovieReviews(movieId: number): Observable<IReview[]> {
    return this.http.get<IReview[]>(`${this.apiUrl}/movies/${movieId}/reviews/`);
  }

  addMovieReview(movieId: number, payload: { text: string; rating: number }): Observable<IReview> {
    return this.http.post<IReview>(`${this.apiUrl}/movies/${movieId}/reviews/`, payload);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
}
