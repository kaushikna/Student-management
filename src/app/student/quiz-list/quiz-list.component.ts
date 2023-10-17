import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { ResourceService } from 'src/app/services/resource.service';
import { TestPaperService } from 'src/app/services/test-paper.service';
import { ModalConfig } from 'src/app/utilities/smart-modal2/modal.config';
import { SmartModal2Component } from 'src/app/utilities/smart-modal2/smart-modal2.component';

declare const $: any;

@Component({
  selector: 'app-quiz-list',
  templateUrl: './quiz-list.component.html',
  styleUrls: ['./quiz-list.component.css']
})
export class QuizListComponent implements OnInit {
  currentUser: any;
  @ViewChild('modal') private modal: SmartModal2Component;
  @ViewChild('modal2') private modal2: SmartModal2Component;

  public addQuizConfig: ModalConfig = {
    modalTitle: "Add Quiz",
    size: 'md'
  };
  public editQuizConfig: ModalConfig = {
    modalTitle: "Edit Quiz",
    size: 'md'
  };
  public viewResultConfig: ModalConfig = {
    modalTitle: "View Result",
    size: 'lg'
  };

  public chapters: any[] = [];
  public activeChapters: any[] = [];
  public papers: any[] = [];
  public quizModel: any = {};
  @Input() modelId: string;
  @Input() subjectId: string;
  @Input() addQuizButton = false;

  constructor(
    private authService: AuthService,
    public toastr: ToastrService,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public testPaperService: TestPaperService,
    private resourceService: ResourceService) { }

  ngOnInit() {
    this.currentUser = this.authService.getUser();
    this.loadData();
    this.getAllQuizPapers();
  }

  public loadData() {
    this.resourceService.getResourceQuiz(this.modelId).subscribe((response) => {
      this.chapters = response.data;
      this.activeChapters = this.chapters.filter((element: any) => element.quiz && element.quiz.length);
    });
  }

  /**
   * getAllSubjects
   */
  public getAllQuizPapers() {
    this.testPaperService.getAllPaper({ publish: true, type: "Quiz", subjectId: this.subjectId }).subscribe((response: any) => {
      this.papers = response.data;
    });
  }


  public editQuiz(): void {
    this.resourceService.editQuiz(this.quizModel).subscribe(() => {
      this.quizModel = {};
      this.toastr.success("Quiz updated successfully", 'Quiz', {
        timeOut: 3000
      });
      this.modal2.close();
      this.loadData();
    }, ({ error }) => {
      this.toastr.error(error.title, 'Quiz', {
        timeOut: 3000
      });
    });
  }


  public addQuiz(): void {
    this.resourceService.addQuiz({ ...this.quizModel }).subscribe(() => {
      this.quizModel = {};
      this.toastr.success("Quiz Added successfully", 'Quiz', {
        timeOut: 3000
      });
      this.modal.close();
      this.loadData();
    }, ({ error }) => {
      this.toastr.error(error.title, 'Quiz', {
        timeOut: 3000
      });
    });
  }



  public openAddQuiz(): void {
    this.quizModel = {
      chapterId: ""
    };
    this.modal.open();
  }


  public openEditQuiz(quiz): void {
    this.quizModel = { ...quiz };
    this.modal2.open();
  }

  public onDeleteConfirm(): void {
    this.resourceService.deleteQuiz(this.quizModel)
      .subscribe(response => {
        this.loadData();
        this.toastr.success(response.message, 'Quiz', {
          timeOut: 3000
        });
        this.onDeleteCancel();
      }, (error) => {
        this.toastr.error(error.error, "Quiz", {
          timeOut: 3000,
        });
      });
  }


  public openDeleteQuiz(entity: any) {
    this.quizModel = { ...entity };
    $('#deleteModalQuiz').modal({
      show: true,
    });
  }

  public onDeleteCancel() {
    $('#deleteModalQuiz').modal('toggle');
    this.quizModel = {};
  }

  public onQuizStart(quiz: any) {

    if (quiz.result) {
      return;
    }
    this.router.navigate(["smart-student/start-test/preview", quiz.testPaperId]);
  }

  public onViewResult(quiz: any) {
    this.router.navigate(["smart-student/result", quiz.resultObj._id]);
  }

}
