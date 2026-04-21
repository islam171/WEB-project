import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { Actor } from '../../models/actor.model';
import { ActivatedRoute, Router } from '@angular/router';
import { MovieService } from '../../services/movie.services';
import { ActorService } from '../../services/actor';
import { Movie } from '../../models/movie.model';

@Component({
  selector: 'app-actor-page',
  imports: [],
  templateUrl: './actor-page.html',
  styleUrl: './actor-page.css',
})
export class ActorPage {

  actor: Actor | null = null;
  private activeRoute = inject(ActivatedRoute);
  private actorService = inject(ActorService);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  private loading = true;
  private error = null;

  constructor() {}

  ngOnInit() {
    this.activeRoute.params.subscribe((params) => {
      const id = +params['id'];
      this.loadData(id)
    });
  }

  private loadData(id: number) {
    this.loading = true;
    this.actorService.getActorById(id).subscribe({
      next: (data: Actor) => {
        this.actor = data;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        this.error = error;
        this.loading = false;
        this.cdr.markForCheck();
      },
    });
  }

  handleLike() {
    if (!this.actor) return;

    if (this.actor.isLiked) {
      this.actor.likes--;
    } else {
      this.actor.likes++;
    }
    this.actor.isLiked = !this.actor.isLiked;
  }
}
