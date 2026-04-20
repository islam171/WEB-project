import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { IUser } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  private userSubject = new BehaviorSubject<IUser | null>(null);
  user$ = this.userSubject.asObservable();

  register(userData: any) {
    return this.http.post(`${this.apiUrl}/register/`, userData);
  }

  login(credentials: any) {
    return this.http.post(`${this.apiUrl}/login/`, credentials).pipe(
      tap((response: any) => {
        localStorage.setItem('token', response.access);
        this.getUserInfo();
      }),
    );
  }

  getUserInfo() {
    return this.http.get(`${this.apiUrl}/user`).subscribe({
      next: (user: any) => {
        this.userSubject.next(user);
      },
      error: (error: any) => {
        console.error(error);
      }
    });
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/sign-in']);
    this.userSubject.next(null);
  }

  isLoggedIn() {
    return !!localStorage.getItem('token');
  }
}
