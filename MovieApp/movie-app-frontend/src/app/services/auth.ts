import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  register(userData: any) {
    return this.http.post(`${this.apiUrl}/register/`, userData);
  }

  login(credentials: any) {
    return this.http.post(`${this.apiUrl}/login/`, credentials).pipe(
      tap((response: any) => {
        localStorage.setItem('token', response.access);
      }),
    );
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/sign-in']);
  }

  isLoggedIn() {
    return !!localStorage.getItem('token');
  }
}
