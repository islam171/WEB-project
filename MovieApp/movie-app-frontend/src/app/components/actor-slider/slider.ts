import { Component, ContentChild, Input, TemplateRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgClass, NgTemplateOutlet } from '@angular/common';

type SliderItem = {
  id: number;
  title?: string;
  name?: string;
  poster?: string;
  photo?: string;
  popularity?: number;
};

@Component({
  selector: 'app-slider',
  standalone: true,
  imports: [RouterLink, NgClass, NgTemplateOutlet],
  templateUrl: './slider.html',
  styleUrl: './slider.css',
})
export class Slider {
  @Input() items: SliderItem[] = [];
  @Input() viewAllLink = '';
  @Input() title = 'Items';
  @Input() itemsToShow = 5;
  @Input() queryParams: any = {};
  @Input() fading = false;

  @ContentChild('itemTemplate') itemTemplate?: TemplateRef<any>;

  currentIndex = 0;

  get maxIndex(): number {
    return Math.max(0, this.items.length - this.itemsToShow);
  }

  get trackTransform(): string {
    return `translateX(-${this.currentIndex * (100 / this.itemsToShow)}%)`;
  }

  next(): void {
    if (this.currentIndex < this.maxIndex) {
      this.currentIndex++;
    }
  }

  prev(): void {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
  }

  isActor(item: SliderItem): boolean {
    return !!item.name && !item.title;
  }

  isMovie(item: SliderItem): boolean {
    return !!item.title;
  }
}
