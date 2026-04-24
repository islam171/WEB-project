import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, finalize, switchMap, tap } from 'rxjs';
import { IUser } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:8000/api';

  private userSubject = new BehaviorSubject<IUser | null>(null);
  user$ = this.userSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  register(userData: { username: string; email?: string; password: string }) {
    return this.http.post(`${this.apiUrl}/register/`, userData);
  }

  login(credentials: { username: string; password: string }) {
    return this.http
      .post<{ access: string; refresh: string }>(`${this.apiUrl}/login/`, credentials)
      .pipe(
        tap((response) => {
          localStorage.setItem('token', response.access);
          localStorage.setItem('refresh', response.refresh);
        }),
        switchMap(() => this.getUserInfo()),
      );
  }

  getUserInfo() {
    return this.http
      .get<IUser>(`${this.apiUrl}/user/`)
      .pipe(tap((user) => this.userSubject.next(user)));
  }

  loadUserFromToken() {
    if (this.isLoggedIn()) {
      this.getUserInfo().subscribe({
        error: () => this.logout(),
      });
    }
  }

  logout() {
    this.http.post(`${this.apiUrl}/logout/`, {}).pipe(
      finalize(() => this.clearSession()),
    ).subscribe();
  }

  private clearSession() {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh');
    this.userSubject.next(null);
    this.router.navigate(['/sign-in']);
  }

  isLoggedIn() {
    return !!localStorage.getItem('token');
  }
}
