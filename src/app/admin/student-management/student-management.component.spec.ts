import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, fakeAsync, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxPaginationModule } from 'ngx-pagination';
import { ToastrModule } from 'ngx-toastr';
import { of } from 'rxjs';
import { StudentService } from 'src/app/services/student.service';
import { MyFilterPipe } from 'src/app/_shared/interfaces/pipes/filter.pipe';

import { StudentManagementComponent } from './student-management.component';

describe('StudentManagementComponent', () => {
  let component: StudentManagementComponent;
  let fixture: ComponentFixture<StudentManagementComponent>;
  let studentService: StudentService;
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule,
        ReactiveFormsModule, FormsModule, ToastrModule.forRoot(), NgxPaginationModule],
      declarations: [StudentManagementComponent, MyFilterPipe]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentManagementComponent);
    component = fixture.componentInstance;
    studentService = TestBed.get(StudentService);
  });

  it('ng OnInit', fakeAsync(() => {
    spyOn(studentService, 'getAllStudents').and.returnValue(of({ data: [], total: 10 }));
    component.ngOnInit();
    studentService.getAllStudents({}).subscribe((response) => {
      component.model.data = response.data;
      component.paginationConfig.totalItems = response.total;
    });
    expect(component.model.data).toEqual([]);
    expect(component.paginationConfig.totalItems).toEqual(10);
  }));
});
