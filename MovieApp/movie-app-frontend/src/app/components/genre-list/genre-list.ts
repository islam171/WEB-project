import { Component, inject, OnInit, signal } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { GenreService } from '../../services/genre.service';
import { Movie } from '../../models/movie.model';
import { IOrder } from '../../models/order.model';
import { IGenre } from '../../models/genre.model';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-genre-list',
  imports: [AsyncPipe, FormsModule],
  templateUrl: './genre-list.html',
  styleUrl: './genre-list.css',
})
export class GenreList implements OnInit {
  private genreService: GenreService = inject(GenreService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  genres$ = this.genreService.genres$;
  selectedGenreIds = signal<number[]>([]);

  ngOnInit() {
    this.genreService.getAll();
    this.route.queryParams.subscribe(params => {
      const genresParam = params['genres'];
      if (genresParam) {
        // Превращаем строку "1,2,3" в массив чисел
        const ids = genresParam.split(',').map((id: string) => +id);
        this.selectedGenreIds.set(ids);
      } else {
        this.selectedGenreIds.set([]);
      }
    });
  }

  // Проверка для шаблона: подсвечен ли чекбокс
  isGenreSelected(id: number): boolean {
    return this.selectedGenreIds().includes(id);
  }

  toggleGenre(id: number) {
    let currentIds = [...this.selectedGenreIds()];

    if (currentIds.includes(id)) {
      // Если уже есть — удаляем
      currentIds = currentIds.filter(genreId => genreId !== id);
    } else {
      // Если нет — добавляем
      currentIds.push(id);
    }

    // Обновляем URL
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        genres: currentIds.length > 0 ? currentIds.join(',') : null
      },
      queryParamsHandling: 'merge', // Сохраняем сортировку (ordering), если она есть
    });
  }
}
