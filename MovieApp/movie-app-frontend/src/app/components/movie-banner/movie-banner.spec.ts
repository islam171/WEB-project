import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovieBanner } from './movie-banner';

describe('MovieBanner', () => {
  let component: MovieBanner;
  let fixture: ComponentFixture<MovieBanner>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MovieBanner],
    }).compileComponents();

    fixture = TestBed.createComponent(MovieBanner);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
