import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { ResourceService } from 'src/app/services/resource.service';
import { DomSanitizer } from '@angular/platform-browser';

declare const pdfjsLib: any;

@Component({
  selector: 'app-view-chapter',
  templateUrl: './view-chapter.component.html',
  styleUrls: ['./view-chapter.component.css']
})
export class ViewChapterComponent implements OnInit {
  currentUser: any;
  model: any = {};
  chapter: any = {};
  lesson: any = {};
  fileLoading = true;
  pdfPagination = {
    pdf: null,
    pageNum: 1,
    scale: 1,
    pageCount: 1,
    pageLoading: false,
    pageNumPending: null
  };
  modelId = "";
  addQuizButton = false;
  public get videoURL() {
    if (this.lesson.video) {
      let parts = this.lesson.video.split("?");

      if (parts[1]) {
        const link = parts[1].split("=")[1];
        if (link) {
          return link;
        }
        return parts[1];
      } else {
        parts = this.lesson.video.split("/");
        return parts[parts.length - 1];

      }


    } else {
      return "";
    }
  }
  public get nextDisable() {
    return this.pdfPagination.pageCount === this.pdfPagination.pageNum;
  }
  public get prevDisable() {
    return 1 === this.pdfPagination.pageNum;
  }
  public activeIds: any[] = [];
  constructor(
    private authService: AuthService,
    public toastr: ToastrService,
    public sanitizer: DomSanitizer,
    public activatedRoute: ActivatedRoute,
    private resourceService: ResourceService) { }

  ngOnInit() {
    this.currentUser = this.authService.getUser();
    this.activatedRoute.params.subscribe((params) => {
      this.modelId = params.id;
      this.activatedRoute.queryParams.subscribe((queryParams) => {
        const { chapterId, lessonId } = queryParams;
        this.loadData(chapterId, lessonId);

      });
    });

    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.body.appendChild(tag);
  }

  public loadData(chapterIndex: number, lessonIndex: number) {
    chapterIndex = chapterIndex || 0;
    lessonIndex = lessonIndex || 0;
    this.resourceService.getResource(this.modelId).subscribe((response) => {
      this.model = response.data;
      this.addQuizButton = this.model.addQuizButton;
      this.chapter = this.model.chapters[chapterIndex];
      this.activeIds = [this.chapter._id];
      this.getLessons(this.chapter, chapterIndex, lessonIndex);
    });
  }

  public getLessons(chapter: any, chapterIndex: number, lessonIndex: number) {

    if (this.model.chapters[chapterIndex].lessons && this.model.chapters[chapterIndex].lessons.length) {
      return;
    }

    this.resourceService.getResourceLessons(chapter._id).subscribe((response) => {


      if (!response.data || !response.data.length) {
        return;
      }

      this.model.chapters[chapterIndex].lessons = response.data;
      this.onLessonClick(this.model.chapters[chapterIndex].lessons[lessonIndex]);

    });
  }


  public renderPage(): void {
    this.pdfPagination.pageLoading = true;
    // Using promise to fetch the page
    this.pdfPagination.pdf.getPage(this.pdfPagination.pageNum).then((page) => {
      const viewport = page.getViewport({ scale: this.pdfPagination.scale });

      const canvas: any = document.getElementById('the-canvas');
      const canvasContext = canvas.getContext('2d');

      canvas.height = viewport.height;
      canvas.width = viewport.width;

      // Render PDF page into canvas context
      const renderContext = {
        canvasContext, viewport
      };
      const renderTask = page.render(renderContext);

      // Wait for rendering to finish
      renderTask.promise.then(() => {
        this.pdfPagination.pageLoading = false;

        if (this.pdfPagination.pageNumPending !== null) {
          // New page rendering is pending
          this.renderPage();
          this.pdfPagination.pageNumPending = null;
        }
      });
    });
  }


  public queueRenderPage(): void {
    if (this.pdfPagination.pageLoading) {
      this.pdfPagination.pageNumPending = this.pdfPagination.pageNum;
    } else {
      this.renderPage();
    }
  }

  public getNextPage(): void {
    if (this.pdfPagination.pageNum >= this.pdfPagination.pdf.numPages) {
      return;
    }
    this.pdfPagination.pageNum++;
    this.queueRenderPage();
  }

  public getPrevPage(): void {
    if (this.pdfPagination.pageNum <= 1) {
      return;
    }
    this.pdfPagination.pageNum--;
    this.queueRenderPage();
  }

  public onLessonClick(lesson: any): void {
    this.lesson = lesson;
    const canvas: any = document.getElementById('the-canvas');
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);

    if (!this.lesson.file) {
      return;
    }

    const loadingTask = pdfjsLib.getDocument(this.lesson.file);
    loadingTask.promise.then((pdf) => {
      this.fileLoading = false;
      console.log('PDF loaded');
      this.pdfPagination.pageCount = pdf.numPages;
      this.pdfPagination.pageNum = 1;
      this.pdfPagination.pdf = pdf;
      this.renderPage();
    }, (reason) => {
      // PDF loading error
      console.error(reason);
    });
  }


}
