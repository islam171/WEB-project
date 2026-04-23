import { Component, ContentChild, Input, TemplateRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgClass, NgTemplateOutlet } from '@angular/common';

type SliderItem = {
  id: number;
  title?: string;
  name?: string;
  poster?: string;
  photo?: string;
  likes?: number;
  isLiked?: boolean;
  is_liked?: boolean;
  inWatchlist?: boolean;
  in_wishlist?: boolean;
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

  get visibleItems(): SliderItem[] {
    return this.items.slice(this.currentIndex, this.currentIndex + this.itemsToShow);
  }

  next(): void {
    if (this.currentIndex + this.itemsToShow < this.items.length) {
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

  toggleActorLike(item: SliderItem, event: Event) {
    event.preventDefault();
    event.stopPropagation();

    const current = item.isLiked ?? item.is_liked ?? false;
    item.isLiked = !current;
    item.is_liked = !current;
    item.likes = !current ? (item.likes ?? 0) + 1 : Math.max(0, (item.likes ?? 0) - 1);
  }

  toggleMovieWishlist(item: SliderItem, event: Event) {
    event.preventDefault();
    event.stopPropagation();

    const current = item.inWatchlist ?? item.in_wishlist ?? false;
    item.inWatchlist = !current;
    item.in_wishlist = !current;
  }
}
