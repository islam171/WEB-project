// 1. Добавляем ChangeDetectorRef в импорты
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { PopularMoviesComponent } from '../../components/popular-movies-slader/popular-movies-slader';
import { PopularActorsSliderComponent } from '../../components/popular-actors-slider/popular-actors-slider';
import { TopTenMoviesComponent } from '../../components/top-ten-movies/top-ten-movies';
import { MovieService } from '../../services/movie.services';
import { Movie } from '../../models/movie.model';
import { RecentWishlistComponent } from '../../components/recent-wishlist/recent-wishlist';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    PopularMoviesComponent,
    PopularActorsSliderComponent,
    TopTenMoviesComponent,
    RecentWishlistComponent,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  popularMovies: Movie[] = [];

  // 2. Инжектируем ChangeDetectorRef в конструктор
  constructor(
    private movieService: MovieService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.movieService.getMovies().subscribe({
      next: (data: Movie[]) => {
        this.popularMovies = data;

        // 3. Говорим Angular: "Данные пришли, можешь безопасно обновлять интерфейс"
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Ошибка при загрузке фильмов:', err);
      },
    });
  }
}
