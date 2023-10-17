import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AlertnotificationComponent } from './alertnotification.component';

describe('AlertnotificationComponent', () => {
  let component: AlertnotificationComponent;
  let fixture: ComponentFixture<AlertnotificationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AlertnotificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertnotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
