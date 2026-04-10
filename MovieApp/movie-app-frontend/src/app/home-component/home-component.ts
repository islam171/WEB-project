import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; // Добавили ChangeDetectorRef
import { CommonModule } from '@angular/common'; // Обязательно для Standalone
import { Movie } from '../models/movie.model';
import { MovieService } from '../services/movie.services';

@Component({
  selector: 'app-home',
  standalone: true, // Убедись, что это стоит
  imports: [CommonModule], // Это разрешает использовать @if, @for и другие функции
  templateUrl: './home-component.html',
  styleUrls: ['./home-component.css'],
})
export class HomeComponent implements OnInit {
  popularMovies: Movie[] = [];
  currentMovieIndex = 0;
  currentMovie: Movie | null = null;
  isLoading = true;

  constructor(
    private movieService: MovieService,
    private cdr: ChangeDetectorRef, // Внедряем "контроллера изменений"
  ) {}

  ngOnInit(): void {
    console.log('Запрос к API отправлен...');
    this.movieService.getMovies().subscribe({
      next: (data: Movie[]) => {
        console.log('ШПИОН: Данные получены успешно!', data);
        this.popularMovies = data;

        if (this.popularMovies.length > 0) {
          this.updateCurrentMovie();
        }

        this.isLoading = false;

        // ПРИНУДИТЕЛЬНО говорим Angular: "Эй, данные обновились, перерисуй экран!"
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('ШПИОН: Ошибка API:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  updateCurrentMovie(): void {
    this.currentMovie = this.popularMovies[this.currentMovieIndex];
  }

  nextMovie(): void {
    if (this.popularMovies.length > 0) {
      this.currentMovieIndex = (this.currentMovieIndex + 1) % this.popularMovies.length;
      this.updateCurrentMovie();
      this.cdr.detectChanges(); // Обновляем UI при клике
    }
  }

  prevMovie(): void {
    if (this.popularMovies.length > 0) {
      this.currentMovieIndex =
        (this.currentMovieIndex - 1 + this.popularMovies.length) % this.popularMovies.length;
      this.updateCurrentMovie();
      this.cdr.detectChanges(); // Обновляем UI при клике
    }
  }

  toggleWatchlist(): void {
    if (this.currentMovie) {
      this.currentMovie.inWatchlist = !this.currentMovie.inWatchlist;
      this.cdr.detectChanges();
    }
  }
}
