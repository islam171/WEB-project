import { Component, computed, Input } from '@angular/core';
import { Actor } from '../../models/actor.model';
import { ActorItem } from '../actor-item/actor-item';

@Component({
  selector: 'app-actor-list',
  imports: [ActorItem],
  templateUrl: './actor-list.html',
  styleUrl: './actor-list.css',
})
export class ActorList {
  @Input() actors: Actor[] | [] = [];

  label = computed(() =>console.log( this.actors))

}
