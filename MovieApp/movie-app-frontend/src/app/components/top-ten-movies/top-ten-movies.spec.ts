import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopTenMovies } from './top-ten-movies';

describe('TopTenMovies', () => {
  let component: TopTenMovies;
  let fixture: ComponentFixture<TopTenMovies>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopTenMovies],
    }).compileComponents();

    fixture = TestBed.createComponent(TopTenMovies);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
