import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { TestPaperService } from './test-paper.service';

describe('TestPaperService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule, RouterTestingModule],
  }));

  it('should be created', () => {
    const service: TestPaperService = TestBed.get(TestPaperService);
    expect(service).toBeTruthy();
  });
});
