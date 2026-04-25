import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { PopularMoviesComponent } from '../../components/popular-movies-slader/popular-movies-slader';
import { TopTenMoviesComponent } from '../../components/top-ten-movies/top-ten-movies';
import { MovieService } from '../../services/movie.services';
import { Movie } from '../../models/movie.model';
import { RecentWishlistComponent } from '../../components/recent-wishlist/recent-wishlist';
import { Actor } from '../../models/actor.model';
import { Slider } from '../../components/actor-slider/slider';
import { ActorCard } from '../../components/actor-card/actor-card';
import { ActorService } from '../../services/actor';

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
  moviesError = '';
  actorsError = '';

  constructor(
    private movieService: MovieService,
    private actorService: ActorService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.movieService.getMovies({ limit: 10 }).subscribe({
      next: (data: Movie[]) => {
        this.popularMovies = data;
        this.moviesError = '';
        this.cdr.detectChanges();
      },
      error: () => {
        this.moviesError = 'Failed to load movies. Please try again later.';
        this.cdr.detectChanges();
      },
    });

    this.actorService.getPopularActors().subscribe({
      next: (data) => {
        this.popularActors = data.slice(0, 20);
        this.actorsError = '';
        this.cdr.detectChanges();
      },
      error: () => {
        this.actorsError = 'Failed to load popular actors. Please try again later.';
        this.cdr.detectChanges();
      },
    });
  }
}
