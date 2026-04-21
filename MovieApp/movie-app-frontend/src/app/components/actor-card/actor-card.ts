import { Component, Input } from '@angular/core';
import { Actor } from '../../models/actor.model';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-actor-card',
  imports: [RouterLink],
  templateUrl: './actor-card.html',
  styleUrl: './actor-card.css',
})
export class ActorCard {
  @Input() actor: Actor | null= null;

  constructor(private router: Router) {
    console.log(this.actor)
  }
}
