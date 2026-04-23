import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Actor } from '../../models/actor.model';
import { ActorCard } from '../../components/actor-card/actor-card';
import { ActorService } from '../../services/actor';

type PopularitySort = 'default' | 'desc' | 'asc';
type SurnameSort = 'default' | 'asc' | 'desc';

@Component({
  selector: 'app-actors-page',
  standalone: true,
  imports: [CommonModule, ActorCard],
  templateUrl: './actors-page.html',
  styleUrl: './actors-page.css',
})
export class ActorsPage implements OnInit {
  private actorService = inject(ActorService);
  private cdr = inject(ChangeDetectorRef);

  actors: Actor[] = [];
  loading = true;
  error = '';

  popularitySort: PopularitySort = 'desc';
  surnameSort: SurnameSort = 'default';

  ngOnInit(): void {
    this.actorService.getAllActors().subscribe({
      next: (actors) => {
        this.actors = actors;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.error = 'Failed to load actors';
        this.loading = false;
        this.cdr.markForCheck();
      },
    });
  }

  setPopularitySort(sort: PopularitySort): void {
    this.popularitySort = sort;
  }

  setSurnameSort(sort: SurnameSort): void {
    this.surnameSort = sort;
  }

  get sortedActors(): Actor[] {
    return [...this.actors].sort((a, b) => {
      if (this.popularitySort !== 'default') {
        const popularityDiff =
          this.popularitySort === 'desc'
            ? (b.popularity ?? 0) - (a.popularity ?? 0)
            : (a.popularity ?? 0) - (b.popularity ?? 0);

        if (popularityDiff !== 0) {
          return popularityDiff;
        }
      }

      if (this.surnameSort !== 'default') {
        const surnameDiff = this.getSurname(a.name).localeCompare(this.getSurname(b.name), 'ru', {
          sensitivity: 'base',
        });

        if (surnameDiff !== 0) {
          return this.surnameSort === 'asc' ? surnameDiff : -surnameDiff;
        }
      }

      return a.name.localeCompare(b.name, 'ru', { sensitivity: 'base' });
    });
  }

  private getSurname(name: string): string {
    const parts = name.trim().split(/\s+/);
    return parts[parts.length - 1] ?? name;
  }
}
