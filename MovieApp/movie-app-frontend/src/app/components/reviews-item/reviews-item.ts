import { Component, Input } from '@angular/core';
import { IReview } from '../../models/movie.model';
import { Rating } from '../rating/rating';



@Component({
  selector: 'app-reviews-item',
  imports: [Rating],
  templateUrl: './reviews-item.html',
  styleUrl: './reviews-item.css',
})
export class ReviewsItem {
  @Input({ required: true }) review!: IReview;
}
