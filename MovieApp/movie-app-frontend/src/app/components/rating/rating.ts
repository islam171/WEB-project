import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-rating',
  imports: [],
  templateUrl: './rating.html',
  styleUrl: './rating.css',
})
export class Rating {
  @Input({required: true}) rating!: number;

  get numericRating(): number {
    return Number(this.rating) || 0;
  }

  get isLowRating(): boolean {
    return this.numericRating >= 1 && this.numericRating <= 4;
  }

  get isMediumRating(): boolean {
    return this.numericRating >= 5 && this.numericRating <= 7;
  }

  get isHighRating(): boolean {
    return this.numericRating >= 8;
  }
}
