import { Component } from '@angular/core';
import { ReviewsItem } from '../reviews-item/reviews-item';
import { IReview } from '../../models/movie.model';

@Component({
  selector: 'app-reviews-list',
  imports: [ReviewsItem],
  templateUrl: './reviews-list.html',
  styleUrl: './reviews-list.css',
})
export class ReviewsList {
  reviews: IReview[] = [
    {
      id: 1,
      username: 'User 1',
      text: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimeLefts by accident, sometimeLefts on purpose (injected humour and the like).",
      rating: 8.0,
      timeLeft: '20 mins ago',
    },
    {
      id: 1,
      username: 'User 2',
      text: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimeLefts by accident, sometimeLefts on purpose (injected humour and the like).",
      rating: 7.5,
      timeLeft: '20 mins ago',
    },
    {
      id: 1,
      username: 'User 3',
      text: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimeLefts by accident, sometimeLefts on purpose (injected humour and the like).",
      rating: 9.5,
      timeLeft: '20 mins ago',
    },
  ];
}
