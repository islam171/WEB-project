import { TestBed } from '@angular/core/testing';

import { Actor } from './actor';

describe('Actor', () => {
  let service: Actor;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Actor);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
