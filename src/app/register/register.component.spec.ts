import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, fakeAsync, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { RecaptchaFormsModule, RecaptchaModule } from 'ng-recaptcha';
import { ToastrModule } from 'ngx-toastr';
import { of } from 'rxjs';
import { TestPaperService } from '../services/test-paper.service';

import { RegisterComponent } from './register.component';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let testService: TestPaperService;


  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule, ToastrModule.forRoot(), ReactiveFormsModule,
        RecaptchaFormsModule, RecaptchaModule],
      declarations: [RegisterComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    testService = TestBed.get(TestPaperService);
  });

  it('ng OnInit', fakeAsync(() => {
    spyOn(testService, 'getAllSubject').and.returnValue(of([]));
    component.ngOnInit();
    testService.getAllSubject({}).subscribe((data) => {
      component.subjects = data;
    });
    expect(component.subjects).toEqual([]);
  }));
});
