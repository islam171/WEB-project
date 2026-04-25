import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentWishlist } from './recent-wishlist';

describe('RecentWishlist', () => {
  let component: RecentWishlist;
  let fixture: ComponentFixture<RecentWishlist>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecentWishlist],
    }).compileComponents();

    fixture = TestBed.createComponent(RecentWishlist);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
