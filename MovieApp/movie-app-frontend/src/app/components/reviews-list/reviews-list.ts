import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ReviewsItem } from '../reviews-item/reviews-item';
import { IReview } from '../../models/movie.model';

@Component({
  selector: 'app-reviews-list',
  imports: [ReviewsItem],
  templateUrl: './reviews-list.html',
  styleUrl: './reviews-list.css',
})
export class ReviewsList {
  @Input() reviews: IReview[] = [];
  @Output() deleted = new EventEmitter<any>();

  deleteReview(event: string) {
    this.deleted.emit(event);
  }
}
