import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [RouterLink, AsyncPipe],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class Header implements OnInit {
  authService: AuthService = inject(AuthService);

  currentUser$ = this.authService.user$;

  logout() {
    this.authService.logout();
  }

  ngOnInit() {
    this.authService.getUserInfo();
  }

  protected readonly onabort = onabort;
}
