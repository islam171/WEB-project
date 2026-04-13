import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Actor } from '../../models/actor.model';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-actor-item',
  imports: [],
  templateUrl: './actor-item.html',
  styleUrl: './actor-item.css',
})
export class ActorItem {
  @Input({ required: true }) actor: Actor | undefined;
}
