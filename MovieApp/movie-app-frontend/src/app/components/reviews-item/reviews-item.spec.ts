import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewsItem } from './reviews-item';

describe('ReviewsItem', () => {
  let component: ReviewsItem;
  let fixture: ComponentFixture<ReviewsItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReviewsItem],
    }).compileComponents();

    fixture = TestBed.createComponent(ReviewsItem);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
