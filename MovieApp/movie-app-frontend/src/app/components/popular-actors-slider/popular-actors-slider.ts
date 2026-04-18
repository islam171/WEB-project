import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; // Добавили ChangeDetectorRef
import { CommonModule } from '@angular/common';
import { MovieService } from '../../services/movie.services';
import { Actor } from '../../models/actor.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-popular-actors-slider',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './popular-actors-slider.html',
  styleUrls: ['./popular-actors-slider.css'],
})
export class PopularActorsSliderComponent implements OnInit {
  actors: Actor[] = [];
  currentIndex: number = 0;
  itemsToShow: number = 5;

  // Инжектируем ChangeDetectorRef в конструктор
  constructor(
    private movieService: MovieService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.movieService.getPopularActors().subscribe((data) => {
      // Жестко ограничиваем массив до 20 элементов (от индекса 0 до 20)
      this.actors = data.slice(0, 20);

      // Сообщаем Angular, что данные изменились и нужно обновить компонент
      this.cdr.detectChanges();
    });
  }

  get visibleActors(): Actor[] {
    return this.actors.slice(this.currentIndex, this.currentIndex + this.itemsToShow);
  }

  next(): void {
    if (this.currentIndex + this.itemsToShow < this.actors.length) {
      this.currentIndex++;
    }
  }

  prev(): void {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
  }
}
