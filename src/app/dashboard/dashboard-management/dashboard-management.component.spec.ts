import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DashboardManagementComponent } from './dashboard-management.component';
import { RouterTestingModule } from '@angular/router/testing';


describe('DashboardManagementComponent', () => {
  let component: DashboardManagementComponent;
  let fixture: ComponentFixture<DashboardManagementComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [DashboardManagementComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
