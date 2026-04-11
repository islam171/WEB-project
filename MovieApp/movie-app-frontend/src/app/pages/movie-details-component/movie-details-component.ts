import { Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { ActorList } from '../../components/actor-list/actor-list';
import { SectionTitle } from '../../components/section-title/section-title';
import { ReviewsList } from '../../components/reviews-list/reviews-list';
import { Rating } from '../../components/rating/rating';

@Component({
  selector: 'app-movie-details-component',
  imports: [NgOptimizedImage, ActorList, SectionTitle, ReviewsList, Rating],
  templateUrl: './movie-details-component.html',
  styleUrl: './movie-details-component.css',
})
export class MovieDetailsComponent {}
