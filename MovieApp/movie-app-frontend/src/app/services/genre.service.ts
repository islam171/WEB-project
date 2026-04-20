import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { IUser } from '../models/user.model';
import { IGenre } from '../models/genre.model';

@Injectable({
  providedIn: 'root',
})
export class GenreService {
  private apiUrl = 'http://localhost:8000/api/';

  // 1. Указываем массив IGenre[] и начальное значение — пустой массив []
  private genreSubject = new BehaviorSubject<IGenre[]>([]);
  genres$ = this.genreSubject.asObservable();

  constructor(private http: HttpClient) {}

  getAll() {
    this.http.get<IGenre[]>(`${this.apiUrl}category`).subscribe({
      next: (data: IGenre[]) => {
        // 2. Вот так данные "проталкиваются" в поток
        this.genreSubject.next(data);
      },
      error: (err) => console.error('Ошибка загрузки жанров:', err)
    });
  }
}