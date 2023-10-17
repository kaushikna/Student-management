import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudHomeComponent } from './stud-home.component';

describe('StudHomeComponent', () => {
  let component: StudHomeComponent;
  let fixture: ComponentFixture<StudHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudHomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
