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

  getPopularActors(): Observable<Actor[]> {
    return this.http.get<Actor[]>(this.apiUrl + 'actors/popular/');
  }

  getAllActors(): Observable<Actor[]> {
    return this.http.get<Actor[]>(this.apiUrl + 'actors/');
  }

  getActorById(id: number): Observable<Actor> {
    return this.http.get<Actor>(this.apiUrl + `actors/${id}/`);
  }
}
