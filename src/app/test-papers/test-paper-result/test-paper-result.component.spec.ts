import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestPaperResultComponent } from './test-paper-result.component';

describe('TestPaperResultComponent', () => {
  let component: TestPaperResultComponent;
  let fixture: ComponentFixture<TestPaperResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestPaperResultComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestPaperResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
