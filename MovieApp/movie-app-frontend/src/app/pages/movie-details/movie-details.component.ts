import { ChangeDetectorRef, Component, inject, signal } from '@angular/core';
import { ActorList } from '../../components/actor-list/actor-list';
import { SectionTitle } from '../../components/section-title/section-title';
import { ReviewsList } from '../../components/reviews-list/reviews-list';
import { Rating } from '../../components/rating/rating';
import { ActivatedRoute } from '@angular/router';
import { Movie } from '../../models/movie.model';
import { MovieService } from '../../services/movie.services';

@Component({
  selector: 'app-movie-details-component',
  imports: [ActorList, SectionTitle, ReviewsList, Rating],
  templateUrl: './movie-details.component.html',
  styleUrl: './movie-details.component.css',
})
export class MovieDetailsComponent {
  private activeRoute = inject(ActivatedRoute)
  private movieService = inject(MovieService);
  private cdr = inject(ChangeDetectorRef);

  movie: Movie | null = null;
  loading: boolean = true;
  error: string = '';

  constructor() {
    this.activeRoute.params.subscribe(params => {
      const id = +params['id'];
      this.loadData(id);
    })
  }

  private loadData(id: number){
    this.loading = true;
    this.movieService.getMovieById(id).subscribe({next: (data: Movie) => {
        this.movie = data;
        this.loading = false;
        this.cdr.markForCheck()
    },
    error: error => {
      this.error = error;
      this.loading = false;
        this.cdr.markForCheck()
    }})
  }

}
