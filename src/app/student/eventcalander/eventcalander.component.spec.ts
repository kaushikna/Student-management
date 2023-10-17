import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventcalanderComponent } from './eventcalander.component';

describe('EventcalanderComponent', () => {
  let component: EventcalanderComponent;
  let fixture: ComponentFixture<EventcalanderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventcalanderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventcalanderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
