// 1. Добавляем ChangeDetectorRef в импорты
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { PopularMoviesComponent } from '../../components/popular-movies-slader/popular-movies-slader';
import { TopTenMoviesComponent } from '../../components/top-ten-movies/top-ten-movies';
import { MovieService } from '../../services/movie.services';
import { Movie } from '../../models/movie.model';
import { RecentWishlistComponent } from '../../components/recent-wishlist/recent-wishlist';
import { Actor } from '../../models/actor.model';
import { Slider } from '../../components/slider/slider';
import { ActorCard } from '../../components/actor-card/actor-card';
import { ActorService } from '../../services/actor';
import { MovieBanner } from '../../components/movie-banner/movie-banner';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    PopularMoviesComponent,
    TopTenMoviesComponent,
    RecentWishlistComponent,
    Slider,
    ActorCard,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  popularMovies: Movie[] = [];
  protected popularActors: Actor[] = [];

  // 2. Инжектируем ChangeDetectorRef в конструктор
  constructor(
    private movieService: MovieService,
    private actorService: ActorService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.movieService.getMovies().subscribe({
      next: (data: Movie[]) => {
        this.popularMovies = data;

        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Ошибка при загрузке фильмов:', err);
      },
    });

    this.actorService.getPopularActors().subscribe((data) => {
      this.popularActors = data.slice(0, 20);
      this.cdr.detectChanges();
    });
  }
}
