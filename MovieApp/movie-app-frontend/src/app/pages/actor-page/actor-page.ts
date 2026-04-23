import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { Actor } from '../../models/actor.model';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ActorService } from '../../services/actor';

@Component({
  selector: 'app-actor-page',
  imports: [RouterLink],
  templateUrl: './actor-page.html',
  styleUrl: './actor-page.css',
})
export class ActorPage {
  actor: Actor | null = null;

  private activeRoute = inject(ActivatedRoute);
  private actorService = inject(ActorService);
  private cdr = inject(ChangeDetectorRef);

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
}
