import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopularMoviesSlader } from './popular-movies-slader';

describe('PopularMoviesSlader', () => {
  let component: PopularMoviesSlader;
  let fixture: ComponentFixture<PopularMoviesSlader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopularMoviesSlader],
    }).compileComponents();

    fixture = TestBed.createComponent(PopularMoviesSlader);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
