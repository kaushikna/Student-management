import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { TeacherService } from './teacher.service';

describe('TeacherService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule, RouterTestingModule],
  }));

  it('should be created', () => {
    const service: TeacherService = TestBed.get(TeacherService);
    expect(service).toBeTruthy();
  });
});
