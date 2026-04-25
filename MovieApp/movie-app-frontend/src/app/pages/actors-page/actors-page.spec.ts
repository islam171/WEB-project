import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActorsPage } from './actors-page';

describe('ActorsPage', () => {
  let component: ActorsPage;
  let fixture: ComponentFixture<ActorsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActorsPage],
    }).compileComponents();

    fixture = TestBed.createComponent(ActorsPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
