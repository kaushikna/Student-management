import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestPaperResultDetailComponent } from './test-paper-result-detail.component';

describe('TestPaperResultDetailComponent', () => {
  let component: TestPaperResultDetailComponent;
  let fixture: ComponentFixture<TestPaperResultDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestPaperResultDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestPaperResultDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
