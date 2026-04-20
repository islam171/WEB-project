import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActorItem } from './actor-item';

describe('ActorItem', () => {
  let component: ActorItem;
  let fixture: ComponentFixture<ActorItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActorItem],
    }).compileComponents();

    fixture = TestBed.createComponent(ActorItem);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
