import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Actor } from '../../models/actor.model';
import { MovieService } from '../../services/movie.services';

@Component({
  selector: 'app-slider',
  imports: [RouterLink],
  templateUrl: './slider.html',
  styleUrl: './slider.css',
})
export class Slider {

  @Input() actors: Actor[] = [];
  currentIndex: number = 0;
  itemsToShow: number = 5;

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
