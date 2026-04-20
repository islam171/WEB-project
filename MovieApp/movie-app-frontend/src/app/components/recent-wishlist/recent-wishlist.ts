import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MovieService } from '../../services/movie.services';
import { Movie } from '../../models/movie.model';

@Component({
  selector: 'app-recent-wishlist',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './recent-wishlist.html',
  styleUrls: ['./recent-wishlist.css'],
})
export class RecentWishlistComponent implements OnInit {
  recentMovies: Movie[] = [];
  isUserLoggedIn: boolean = false;

  constructor(private movieService: MovieService) {}

  ngOnInit(): void {
    // Проверяем авторизацию
    this.isUserLoggedIn = this.movieService.isLoggedIn();

    // Если авторизован, грузим фильмы
    if (this.isUserLoggedIn) {
      this.movieService.getRecentWishlist().subscribe({
        next: (movies) => {
          this.recentMovies = movies;
        },
        error: (err) => console.error('Ошибка загрузки вишлиста', err),
      });
    }
  }
}
