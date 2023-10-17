import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, fakeAsync, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxPaginationModule } from 'ngx-pagination';
import { ToastrModule } from 'ngx-toastr';
import { of } from 'rxjs';
import { TeacherService } from 'src/app/services/teacher.service';
import { TestPaperService } from 'src/app/services/test-paper.service';
import { MyFilterPipe } from 'src/app/_shared/interfaces/pipes/filter.pipe';

import { TeacherManagementComponent } from './teacher-management.component';

describe('TeacherManagementComponent', () => {
  let component: TeacherManagementComponent;
  let fixture: ComponentFixture<TeacherManagementComponent>;
  let teacherService: TeacherService;
  let testService: TestPaperService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule, FormsModule
        , ReactiveFormsModule, ToastrModule.forRoot(), NgxPaginationModule],
      declarations: [TeacherManagementComponent, MyFilterPipe]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeacherManagementComponent);
    component = fixture.componentInstance;
    teacherService = TestBed.get(TeacherService);
    testService = TestBed.get(TestPaperService);
  });

  it('ng OnInit', fakeAsync(() => {
    spyOn(teacherService, 'getTeachers').and.returnValue(of({ data: [], total: 10 }));
    spyOn(testService, 'getAllSubject').and.returnValue(of({ data: [], total: 10 }));
    component.ngOnInit();
    teacherService.getTeachers({}).subscribe((response) => {
      component.model.data = response.data;
      component.paginationConfig.totalItems = response.total;
    });
    testService.getAllSubject({}).subscribe((response) => {
      component.subjectList = response.data;
    });
    expect(component.model.data).toEqual([]);
    expect(component.subjectList).toEqual([]);
    expect(component.paginationConfig.totalItems).toEqual(10);
  }));
});
