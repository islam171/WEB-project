import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable,BehaviorSubject, tap } from 'rxjs';
import { Movie } from '../models/movie.model';
import { Actor } from '../models/actor.model';

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  // Адрес нашего Django API
  private apiUrl = 'http://localhost:8000/api/';

  constructor(private http: HttpClient) {}

  // Метод для получения фильмов с бэкенда
  getMovies(): Observable<Movie[]> {
    return this.http.get<Movie[]>(this.apiUrl + 'movies/');
  }

  // Метод получение популярных актеров
  getPopularActors(): Observable<any> {
    return this.http.get<Actor[]>(this.apiUrl + 'actors/popular/');
  }

  // Метод для получения всех актеров
  getAllActors(): Observable<any> {
    return this.http.get<Actor[]>(this.apiUrl + 'actors/');
  }

  getMovieById(id: number): Observable<any>{
    return this.http.get<Movie>(this.apiUrl + 'movies/' + id);
  }

  private wishlistIds$ = new BehaviorSubject<Set<number>>(new Set());

   getWishlist(): Observable<{ id: number; movies: Movie[] }> {
    return this.http.get<any>(this.apiUrl + 'wishlist/').pipe(
      tap(w => this.wishlistIds$.next(new Set(w.movies.map((m: Movie) => m.id))))
    );
  }

  get wishlistIds() {
    return this.wishlistIds$.asObservable();
  }

  toggleWishlist(movieId: number): Observable<any> {
    return this.http.post<any>(this.apiUrl + 'wishlist/toggle/', { movie_id: movieId }).pipe(
      tap(res => {
        const ids = new Set(this.wishlistIds$.value);
        res.status === 'added' ? ids.add(movieId) : ids.delete(movieId);
        this.wishlistIds$.next(ids);
      })
    );
  }

  isInWishlist(movieId: number): boolean {
    return this.wishlistIds$.value.has(movieId);
  }

  // Проверка, авторизован ли пользователь (проверяем наличие токена)
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  // Получение последних 6 фильмов
  getRecentWishlist(): Observable<Movie[]> {
    return this.http.get<Movie[]>(`${this.apiUrl}/wishlist/recent/`);
  }

}
