import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-rating',
  imports: [],
  templateUrl: './rating.html',
  styleUrl: './rating.css',
})
export class Rating {
  @Input({required: true}) rating!: number;
}
