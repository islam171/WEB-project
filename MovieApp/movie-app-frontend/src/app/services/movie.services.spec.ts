import { TestBed } from '@angular/core/testing';

import { MovieServices } from './movie.services';

describe('Movie', () => {
  let service: MovieServices;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MovieServices);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
