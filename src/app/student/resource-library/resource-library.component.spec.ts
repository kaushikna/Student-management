import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxPaginationModule } from 'ngx-pagination';
import { ToastrModule } from 'ngx-toastr';
import { Role } from 'src/app/Models';

import { ResourceLibraryComponent } from './resource-library.component';

describe('ResourceLibraryComponent', () => {
  let component: ResourceLibraryComponent;
  let fixture: ComponentFixture<ResourceLibraryComponent>;
  const admin = { role: Role.ADMIN, name: "admin" };
  const student = { role: Role.STUDENT, name: "student" };
  const teacher = { role: Role.TUTOR, name: "teacher" };


  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule, ToastrModule.forRoot(), NgxPaginationModule],
      declarations: [ResourceLibraryComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceLibraryComponent);
    component = fixture.componentInstance;
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should create admin', () => {
    localStorage.setItem('currentUser', JSON.stringify(admin));
    const refreshData = spyOn(component, 'refreshData');
    const getAllSubjects = spyOn(component, 'getAllSubjects');
    fixture.detectChanges();
    expect(component.currentUser.role).toEqual(Role.ADMIN);
    expect(component.currentUser.route).toEqual(Role.ADMIN);
    expect(component.currentUser.name).toEqual(Role.ADMIN);
    expect(refreshData).toHaveBeenCalled();
    expect(getAllSubjects).toHaveBeenCalled();
  });

  it('should create student', () => {
    localStorage.setItem('currentUser', JSON.stringify(student));
    const refreshData = spyOn(component, 'refreshData');
    const getAllSubjects = spyOn(component, 'getAllSubjects');
    component.ngOnInit();
    expect(component.currentUser.role).toEqual(Role.STUDENT);
    expect(component.currentUser.route).toEqual("smart-student");
    expect(component.currentUser.name).toEqual(Role.STUDENT);
    expect(refreshData).toHaveBeenCalled();
    expect(getAllSubjects).toHaveBeenCalled();
  });

  it('should create tutor', () => {
    localStorage.setItem('currentUser', JSON.stringify(teacher));
    const refreshData = spyOn(component, 'refreshData');
    const getAllSubjects = spyOn(component, 'getAllSubjects');
    fixture.detectChanges();
    expect(component.currentUser.role).toEqual(Role.TUTOR);
    expect(component.currentUser.route).toEqual("smart-tutor");
    expect(component.currentUser.name).toEqual("teacher");
    expect(refreshData).toHaveBeenCalled();
    expect(getAllSubjects).toHaveBeenCalled();
  });
});
