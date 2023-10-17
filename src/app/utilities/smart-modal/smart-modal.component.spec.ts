import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SmartModalComponent } from './smart-modal.component';

describe('SmartModalComponent', () => {
  let component: SmartModalComponent;
  let fixture: ComponentFixture<SmartModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SmartModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmartModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
