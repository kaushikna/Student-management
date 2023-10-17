import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { StudentService } from './student.service';

describe('StudentService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule,RouterTestingModule]
  }));

  it('should be created', () => {
    const service: StudentService = TestBed.get(StudentService);
    expect(service).toBeTruthy();
  });
});
