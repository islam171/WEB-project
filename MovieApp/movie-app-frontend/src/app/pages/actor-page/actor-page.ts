import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { Actor } from '../../models/actor.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ActorService } from '../../services/actor';

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

  private loading = true;
  private error: any = null;

  ngOnInit() {
    this.activeRoute.params.subscribe((params) => {
      const id = +params['id'];
      this.loadData(id);
    });
  }

  private loadData(id: number) {
    this.loading = true;
    this.actorService.getActorById(id).subscribe({
      next: (data: Actor) => {
        this.actor = {
          ...data,
          isLiked: data.isLiked ?? data.is_liked ?? false,
          is_liked: data.is_liked ?? data.isLiked ?? false,
          likes: data.likes ?? 0,
        };
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

    const likedNow = this.actor.isLiked ?? this.actor.is_liked ?? false;

    if (likedNow) {
      this.actor.likes = Math.max(0, (this.actor.likes ?? 0) - 1);
    } else {
      this.actor.likes = (this.actor.likes ?? 0) + 1;
    }

    this.actor.isLiked = !likedNow;
    this.actor.is_liked = !likedNow;
    this.cdr.markForCheck();
  }
}
