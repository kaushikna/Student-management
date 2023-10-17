import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, fakeAsync, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxPaginationModule } from 'ngx-pagination';
import { ToastrModule } from 'ngx-toastr';
import { AngularEditorModule } from '@kolkov/angular-editor';


import { StartTestComponent } from './start-test.component';
import { TestPaperService } from 'src/app/services/test-paper.service';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

describe('StartTestComponent', () => {
  let component: StartTestComponent;
  let fixture: ComponentFixture<StartTestComponent>;
  let testService: TestPaperService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule, ToastrModule.forRoot(), NgxPaginationModule, AngularEditorModule],
      declarations: [StartTestComponent],
      providers: [{
        provide: ActivatedRoute, useValue: {
          params: of([{ name: "paper1" }]),
        },
        TestPaperService
      }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StartTestComponent);
    component = fixture.componentInstance;
    testService = TestBed.get(TestPaperService);
  });

  it('ng OnInit', fakeAsync(() => {
    spyOn(testService, 'getAllQuestionsPopulate').and.returnValue(of({ data: [] }));
    spyOn(component, 'loadTest');
    component.ngOnInit();
    testService.getAllQuestionsPopulate("").subscribe(() => {
      component.mode = "test";
    });
    expect(component.loadTest).toHaveBeenCalled();
    expect(component.mode).toEqual("test");
  }));
});
