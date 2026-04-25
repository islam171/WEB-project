import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { IReview } from '../../models/movie.model';
import { Rating } from '../rating/rating';
import { MovieService } from '../../services/movie.services';



@Component({
  selector: 'app-reviews-item',
  imports: [Rating],
  templateUrl: './reviews-item.html',
  styleUrl: './reviews-item.css',
})
export class ReviewsItem {
  @Input({ required: true }) review!: IReview;
  @Output() deleted = new EventEmitter();

  movieService = inject(MovieService);

  deleteReview(){
    this.deleted.emit("click");
  }

}
