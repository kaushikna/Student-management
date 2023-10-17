import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCalanderEventComponent } from './admin-calander-event.component';

describe('AdminCalanderEventComponent', () => {
  let component: AdminCalanderEventComponent;
  let fixture: ComponentFixture<AdminCalanderEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminCalanderEventComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminCalanderEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
