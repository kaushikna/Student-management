import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ScheduleClassesComponent } from './schedule-classes.component';

describe('ScheduleClassesComponent', () => {
  let component: ScheduleClassesComponent;
  let fixture: ComponentFixture<ScheduleClassesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ScheduleClassesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduleClassesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
