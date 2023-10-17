import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, fakeAsync, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { TestPaperService } from 'src/app/services/test-paper.service';

import { AvailableTestpapersComponent } from './available-testpapers.component';

describe('AvailableTestpapersComponent', () => {
  let component: AvailableTestpapersComponent;
  let fixture: ComponentFixture<AvailableTestpapersComponent>;
  let testService: TestPaperService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      declarations: [AvailableTestpapersComponent],
      providers: [AuthService, TestPaperService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AvailableTestpapersComponent);
    component = fixture.componentInstance;
    testService = TestBed.get(TestPaperService);
  });

  it('ng OnInit', fakeAsync(() => {
    spyOn(testService, 'getAllPaperForStudent').and.returnValue(of([]));
    component.ngOnInit();
    testService.getAllPaperForStudent().subscribe(() => {
      component.tests = [];
    });
    expect(component.tests).toEqual([]);
  }));
});
