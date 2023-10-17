import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { ResourceService } from 'src/app/services/resource.service';
import { TestPaperService } from 'src/app/services/test-paper.service';
import { ModalConfig } from 'src/app/utilities/smart-modal2/modal.config';
import { SmartModal2Component } from 'src/app/utilities/smart-modal2/smart-modal2.component';

declare const $: any;

@Component({
  selector: 'app-view-resource',
  templateUrl: './view-resource.component.html',
  styleUrls: ['./view-resource.component.css']
})
export class ViewResourceComponent implements OnInit {
  currentUser: any;
  model: any = {};
  deleteEntity = "";
  modelId = "";
  subjects: any[] = [];
  uploading = false;
  addLessonButton = false;
  addChapterButton = false;
  addQuizButton = false;
  activeIds: any[] = [];

  @ViewChild('modal2') private modal2: SmartModal2Component;
  @ViewChild('modal3') private modal3: SmartModal2Component;
  @ViewChild('modal4') private modal4: SmartModal2Component;
  @ViewChild('modal5') private modal5: SmartModal2Component;
  @ViewChild('resourceFileInput') resourceFileInput: ElementRef;

  public addChapterConfig: ModalConfig = {
    modalTitle: "Add Chapter",
    size: 'md'
  };
  public editChapterConfig: ModalConfig = {
    modalTitle: "Edit Chapter",
    size: 'md'
  };
  public addLessonConfig: ModalConfig = {
    modalTitle: "Add Lesson",
    size: 'lg'
  };
  public editLessonConfig: ModalConfig = {
    modalTitle: "Edit Lesson",
    size: 'lg'
  };
  public resourceModel: any = {
    entityType: "ACT"
  };
  public resourceTypes: any = [
    {
      title: "ACT",
      value: "ACT"
    }
  ];


  public chapterModel: any = {};
  public lessonModel: any = {};

  constructor(
    private authService: AuthService,
    public toastr: ToastrService,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public testPaperService: TestPaperService,
    private resourceService: ResourceService) { }

  ngOnInit() {
    this.currentUser = this.authService.getUser();
    this.activatedRoute.params.subscribe((params) => {
      this.modelId = params.id;
      this.loadData();

    });

    this.getAllSubjects();

  }

  public loadData() {
    this.activeIds = [];
    this.resourceService.getResource(this.modelId).subscribe((response) => {
      this.model = response.data;
      this.addChapterButton = this.model.addChapterButton;
      this.addQuizButton = this.model.addQuizButton;
      this.addLessonButton = this.model.addLessonButton;
    });
  }

  public getLessons(chapter: any, index: number) {

    if (chapter.opened) {
      chapter.opened = false;
      return;
    }

    this.resourceService.getResourceLessons(chapter._id).subscribe((response) => {
      this.model.chapters[index].lessons = response.data;
      chapter.opened = true;
    });
  }

  /**
   * getAllSubjects
   */
  public getAllSubjects() {
    this.testPaperService.getAllSubject().subscribe((response: any) => {
      this.subjects = response.data;
    });
  }


  public editChapter(): void {
    this.resourceService.editChapter(this.chapterModel).subscribe(() => {
      this.chapterModel = {};
      this.toastr.success("Chapter updated successfully", 'Resource', {
        timeOut: 3000
      });
      this.modal3.close();
      this.loadData();
    }, ({ error }) => {
      this.toastr.error(error.title, 'Resource', {
        timeOut: 3000
      });
    });
  }

  public editLesson(): void {
    this.resourceService.editLesson(this.lessonModel).subscribe(() => {
      this.lessonModel = {};
      this.toastr.success("Lesson updated successfully", 'Resource', {
        timeOut: 3000
      });
      this.modal5.close();
      this.loadData();
    }, ({ error }) => {
      this.toastr.error(error.title, 'Lesson', {
        timeOut: 3000
      });
    });
  }

  public addChapter(): void {
    this.resourceService.addChapter({ resourceId: this.model._id, ...this.chapterModel }).subscribe(() => {
      this.chapterModel = {};
      this.toastr.success("Chapter updated successfully", 'Resource', {
        timeOut: 3000
      });
      this.modal2.close();
      this.loadData();
    }, ({ error }) => {
      this.toastr.error(error.title, 'Chapter', {
        timeOut: 3000
      });
    });
  }

  public addLesson(): void {
    this.resourceService.addLesson({ chapterId: this.chapterModel._id, ...this.lessonModel }).subscribe(() => {
      this.lessonModel = {};
      this.toastr.success("Lesson Added successfully", 'Lesson', {
        timeOut: 3000
      });
      this.modal4.close();
      this.loadData();
    }, ({ error }) => {
      this.toastr.error(error.title, 'Lesson', {
        timeOut: 3000
      });
    });
  }



  public openAddChapter(): void {
    this.chapterModel = {};
    this.modal2.open();
  }

  public onDeleteConfirm(): void {
    if (this.deleteEntity === "chapter") {
      this.resourceService.deleteChapter(this.chapterModel)
        .subscribe(response => {
          this.loadData();
          this.toastr.success(response.message, 'Chapter', {
            timeOut: 3000
          });
          this.onDeleteCancel();
        }, (error) => {
          this.toastr.error(error.error, "Chapter", {
            timeOut: 3000,
          });
        });
    }
    if (this.deleteEntity === "lesson") {
      this.resourceService.deleteLesson(this.lessonModel)
        .subscribe(response => {
          this.loadData();
          this.toastr.success(response.message, 'Lesson', {
            timeOut: 3000
          });
          this.onDeleteCancel();
        }, (error) => {
          this.toastr.error(error.error, "Lesson", {
            timeOut: 3000,
          });
        });
    }


  }



  public openEditChapter(event: any, chapter: any): void {
    event.preventDefault();
    this.chapterModel = { ...chapter };
    this.modal3.open();
    event.stopPropagation();
  }

  public openDeleteItem(event: any, entity: any, type: string): void {
    event.preventDefault();
    this.deleteEntity = type;
    if (this.deleteEntity === "chapter") {
      this.chapterModel = { ...entity };

    }
    if (this.deleteEntity === "lesson") {
      this.lessonModel = { ...entity };

    }

    $('#deleteModal').modal({
      show: true,
    });
    event.stopPropagation();
  }

  public onDeleteCancel() {
    $('#deleteModal').modal('toggle');
    this.chapterModel = {};
    this.lessonModel = {};
    this.deleteEntity = "";
  }


  public openAddLesson(chapter: any): void {
    this.chapterModel = { ...chapter };
    this.lessonModel = {};
    this.modal4.open();
  }

  public openEditLesson(event: any, chapter: any, lesson: any): void {
    event.preventDefault();
    this.chapterModel = { ...chapter };
    this.lessonModel = { ...lesson };
    this.modal5.open();
    event.stopPropagation();
  }

  public onFileButtonClick() {
    this.resourceFileInput.nativeElement.click();
  }

  public async uploadFile(event: any) {

    this.uploading = true;

    const file = event.target.files[0] as File;
    const reader = new FileReader();
    // reader.onload = () => {
    //   this.lessonModel.file = reader.result as string;
    // };
    reader.readAsDataURL(file);

    this.authService.upload('file', file, "resource")
      .subscribe(data => {
        this.lessonModel.file = data.url;
        this.uploading = false;
      }, error => {
        this.uploading = false;
        console.log("error in upload ");
        console.log(error);
      });
  }

  onViewLesson(chapterIndex: any, lessonIndex: any) {
    const route = this.currentUser.route;
    this.router.navigate([route, "resource-library", this.model._id, "chapters"], {
      queryParams: {
        chapterId: chapterIndex,
        lessonId: lessonIndex,
      }
    });
  }



}
