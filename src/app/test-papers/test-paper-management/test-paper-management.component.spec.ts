import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, fakeAsync, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastrModule } from 'ngx-toastr';
import { of } from 'rxjs';
import { TestPaperService } from 'src/app/services/test-paper.service';

import { TestPaperManagementComponent } from './test-paper-management.component';

describe('TestPaperManagementComponent', () => {
  let component: TestPaperManagementComponent;
  let fixture: ComponentFixture<TestPaperManagementComponent>;
  let testService: TestPaperService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule, ToastrModule.forRoot()],
      declarations: [TestPaperManagementComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestPaperManagementComponent);
    component = fixture.componentInstance;
    testService = TestBed.get(TestPaperService);

  });


  it('ng OnInit', fakeAsync(() => {
    spyOn(testService, 'getAllPaper').and.returnValue(of([]));
    spyOn(testService, 'getTestpaperTypes').and.returnValue(of([]));
    spyOn(component, 'getAllSubjects');
    spyOn(component, 'getTestpaperTypes');
    component.ngOnInit();
    expect(component.getAllSubjects).toHaveBeenCalled();
    expect(component.getTestpaperTypes).toHaveBeenCalled();
    testService.getAllPaper({}).subscribe((data) => {
      component.papers = data;
    });
    testService.getTestpaperTypes().subscribe((data) => {
      component.testPaperTypes = data;
    });
    expect(component.papers).toEqual([]);
    expect(component.testPaperTypes).toEqual([]);
  }));

});
