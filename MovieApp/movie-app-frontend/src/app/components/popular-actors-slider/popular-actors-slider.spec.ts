import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopularActorsSlider } from './popular-actors-slider';

describe('PopularActorsSlider', () => {
  let component: PopularActorsSlider;
  let fixture: ComponentFixture<PopularActorsSlider>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopularActorsSlider],
    }).compileComponents();

    fixture = TestBed.createComponent(PopularActorsSlider);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
