import {
  ChangeDetectorRef,
  Component,
  ContentChild,
  inject,
  Input,
  TemplateRef,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'app-slider',
  imports: [RouterLink, NgTemplateOutlet],
  templateUrl: './slider.html',
  styleUrl: './slider.css',
})
export class Slider {
  @Input() title: string = '';
  @Input() items: any[] = [];
  @Input() viewAllLink: string = '/';
  @Input() queryParams: {} = {};
  @Input() itemsToShow: number = 5;
  @Input() fading: boolean = false;

  // Позволяет передавать кастомную верстку для карточки извне
  @ContentChild('itemTemplate') itemTemplate: TemplateRef<any> | null = null;

  cdr = inject(ChangeDetectorRef);

  currentIndex: number = 0;
  isFading = false;

  get visibleItems() {
    return this.items.slice(this.currentIndex, this.currentIndex + this.itemsToShow);
  }

  next() {
    if (this.isFading) return;

    this.isFading = true;
    setTimeout(() => {
      if (this.currentIndex + this.itemsToShow < this.items.length) {
        this.currentIndex++;
        this.cdr.detectChanges();
      }
      this.isFading = false;
      this.cdr.detectChanges();
    }, 150);
  }

  prev() {
    if (this.isFading) return;

    this.isFading = true;
    setTimeout(() => {
      if (this.currentIndex > 0) {
        this.currentIndex--;
        this.cdr.detectChanges();
      }
      this.isFading = false;
      this.cdr.detectChanges();
    }, 150);
  }
}
