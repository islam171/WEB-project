import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Movie } from '../models/movie.model';
import { Actor } from '../models/actor.model';

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

  // Метод получение популярных актеров
  getPopularActors(): Observable<any> {
    return this.http.get<Actor[]>(this.apiUrl + '/actors/popular/');
  }

  // Метод для получения всех актеров
  getAllActors(): Observable<any> {
    return this.http.get<Actor[]>(this.apiUrl + '/actors/');
  }
}
