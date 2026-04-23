import { Component, Input } from '@angular/core';
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
}
