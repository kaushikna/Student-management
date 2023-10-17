import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

import { QuestionPanelComponent } from './question-panel.component';

describe('QuestionPanelComponent', () => {
  let component: QuestionPanelComponent;
  let fixture: ComponentFixture<QuestionPanelComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, HttpClientTestingModule, RouterTestingModule],
      declarations: [QuestionPanelComponent],
      providers: [FormGroupDirective]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
