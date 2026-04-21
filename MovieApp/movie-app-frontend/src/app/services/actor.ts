import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Actor } from '../models/actor.model';

@Injectable({
  providedIn: 'root',
})
export class ActorService {
  private apiUrl = 'http://localhost:8000/api/';

  constructor(private http: HttpClient) {}

  // Метод получение популярных актеров
  getPopularActors(): Observable<any> {
    return this.http.get<Actor[]>(this.apiUrl + 'actors/popular/');
  }


  // Метод для получения всех актеров
  getAllActors(): Observable<any> {
    return this.http.get<Actor[]>(this.apiUrl + 'actors/');
  }

  getActorById(id: number): Observable<any>{
    return this.http.get<Actor>(this.apiUrl + 'actors/' + id);
  }

}
