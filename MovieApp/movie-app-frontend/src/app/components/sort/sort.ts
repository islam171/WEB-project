import { Component, inject, OnInit, signal } from '@angular/core';
import { IOrder } from '../../models/order.model';
import { ActivatedRoute, Router } from '@angular/router';
import { NgClass } from '@angular/common';
import { debounceTime, distinctUntilChanged, startWith, switchMap } from 'rxjs';

@Component({
  selector: 'app-sort',
  imports: [NgClass],
  templateUrl: './sort.html',
  styleUrl: './sort.css',
})
export class Sort implements OnInit {
  router = inject(Router);
  route = inject(ActivatedRoute);

  orders: IOrder[] = [
    {
      id: 1,
      key: 'title',
      title: 'Name',
    },
    {
      id: 2,
      key: 'year',
      title: 'Year',
    },
    {
      id: 1,
      key: 'duration',
      title: 'Duration',
    },
  ];

  protected SortBarIsOpen = false;

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      const orderingKey = params['ordering'];
      if (orderingKey) {
        // Ищем объект в массиве orders по ключу из URL
        const foundOrder = this.orders.find(o => o.key === orderingKey);

        if (foundOrder) {
          // Обновляем сигнал найденным значением
          this.order.set(foundOrder);
        }
      } else {
        // Если параметра в URL нет, можно сбросить на значение по умолчанию
        this.order.set(this.orders[0]);
      }
    });
  }

  showSort() {
    this.SortBarIsOpen = !this.SortBarIsOpen;
  }

  order = signal<IOrder>(this.orders[0]);
  selectOrder(value: IOrder) {
    this.order.set(value);
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { ordering: value.key },
      queryParamsHandling: 'merge',
    });

    this.SortBarIsOpen = false;
  }
}
