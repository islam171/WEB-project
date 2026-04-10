import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Movie } from '../models/movie.model';

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  // Адрес нашего Django API
  private apiUrl = 'http://localhost:8000/api/movies/';

  constructor(private http: HttpClient) {}

  // Метод для получения фильмов с бэкенда
  getMovies(): Observable<Movie[]> {
    return this.http.get<Movie[]>(this.apiUrl);
  }
}
