import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-actor-item',
  imports: [],
  templateUrl: './actor-item.html',
  styleUrl: './actor-item.css',
})
export class ActorItem {
  @Input({required: true}) title!: string;
  @Input({required: true}) img!: string;
}
