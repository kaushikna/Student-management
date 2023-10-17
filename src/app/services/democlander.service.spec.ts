import { TestBed } from '@angular/core/testing';

import { DemoclanderService } from './democlander.service';

describe('DemoclanderService', () => {
  let service: DemoclanderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DemoclanderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
