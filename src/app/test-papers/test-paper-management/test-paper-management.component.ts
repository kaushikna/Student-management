import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators, FormArray } from "@angular/forms";
import { TestPaperService } from "../../services/test-paper.service";
import { ToastrService } from "ngx-toastr";
import { EntityService } from "src/app/services/entity.service";
import { PaginationInstance } from "ngx-pagination";
import { Router } from "@angular/router";
import { SubjectManagementComponent } from "../subjects/subjects.component";
declare const $: any;

@Component({
  selector: "app-test-paper-management",
  templateUrl: "./test-paper-management.component.html",
  styleUrls: ["./test-paper-management.component.css"],
})
export class TestPaperManagementComponent
  extends SubjectManagementComponent
  implements OnInit
{
  panelOpenState = false;
  panelOpenState2 = false;
  questionNum = 0;
  testPaperTypes = [];
  questionUploadTypes = [
    {
      id: 0,
      value: "Text",
    },
    {
      id: 1,
      value: "Image",
    },
    {
      id: 2,
      value: "Text & Image",
    },
  ];
  optionUploadTypes = [
    {
      id: 0,
      value: "Text",
    },
    {
      id: 1,
      value: "Image",
    },
  ];
  questionTypes = [
    {
      id: 0,
      value: "Simple",
    },
    {
      id: 1,
      value: "Passage",
    },
  ];
  optionTypes = [
    {
      id: 0,
      value: "Radio",
    },
    {
      id: 1,
      value: "Check",
    },
  ];
  selectedDate= new Date
  question: any = {};
  questions: any = [];
  students: any = [];
  testPapersForm: FormGroup;
  questionsFormArray: FormArray;
  paginationQuestions = [];
  questionArray = [];
  questionPapersForm: FormGroup;
  subid = null;
  showPaperFlag = false;
  addPaperFlag = false;
  questionPaperFlag = false;
  questionPaperEditFlag = false;
  // isDisabledFlag = true;
  currentquestion = 0;
  totalquestion = 0;
  papers = [];
  passageFlag = false;
  selectedPaper = { paper: {}, subject: {} };
  subjectSubcat = [];
  paperModel: any = {};
  public paginationConfig: PaginationInstance = {
    id: "paginationListId",
    itemsPerPage: 5,
    currentPage: 1,
    totalItems: 0,
  };
  selectedItem: any;
  subjects: any[] = [];
  entityType: string;

  constructor(
    public testService: TestPaperService,
    public toastr: ToastrService,
    public router: Router,
    public entityService: EntityService
  ) {
    super(testService, toastr, entityService);
    this.question = {
      questionType: this.questionTypes,
      questionUploadType: this.questionUploadTypes,
      optionType: this.optionTypes,
      optionUploadType: this.optionUploadTypes,
    };
    this.prepareQuestions(1);
  }
  ngOnInit(): void {
    this.questionsFormArray = this.questionPapersForm.controls
      .questions as FormArray;
    this.showPaperFlag = false;
    this.getTestpaperTypes();
    this.getEntities(() => {
      this.getAllPaper();
    });
  }

  getTestpaperTypes() {
    this.testService.getTestpaperTypes().subscribe(
      ({ data }) => {
        this.testPaperTypes = data;
      },
      (error) => {
        this.testPaperTypes = [];
        // console.log("error in Add " + error);
        this.toastr.error(error.error.message, "Save Failed", {
          timeOut: 3000,
        });
      }
    );
  }

  onExamTypeChangeGlobal() {
    this.paginationConfig.currentPage = 1;
    this.paginationConfig.itemsPerPage = 5;
    this.getAllPaper();
  }

  onExamTypeChange() {
    this.getAllSubjects(this.paperModel.entityType);
    this.paperModel.subject = [];
    this.addsubPaper();
  }

  getOptionFormGoup() {
    return new FormGroup({
      entryType: new FormControl(0, { validators: Validators.required }),
      entryText: new FormControl("", { validators: Validators.required }),
      entryImage: new FormControl("", { validators: Validators.required }),
      selectedOption: new FormControl("", { validators: Validators.required }),
    });
  }
  getOptions() {
    const optionForm = new FormArray([]);
    for (let i = 1; i <= 4; i++) {
      optionForm.push(this.getOptionFormGoup());
    }
    return optionForm;
  }
  getQuestionFormGoup() {
    return new FormGroup({
      // quetionType: new FormControl(0, {
      //   validators: Validators.required,
      // }),
      questionNum: new FormControl("", { validators: Validators.required }),
      questionTypeId: new FormControl(0, { validators: Validators.required }), // 0-simple,1-image
      image: new FormControl("", { validators: Validators.required }),
      resultOption: new FormControl("", { validators: Validators.required }),
      marks: new FormControl(null, Validators.required),
      name: new FormControl("", { validators: Validators.required }),
      optionsType: new FormControl(0, {
        validators: Validators.required,
      }),
      options: this.getOptions(),
    });
  }
  getQuestions(limit) {
    const questionFormArray = new FormArray([]);
    for (let i = 1; i <= limit; i++) {
      this.questions.push(this.question);
      questionFormArray.push(this.getQuestionFormGoup());
    }
    return questionFormArray;
  }

  prepareQuestions(limit) {
    this.questionPapersForm = new FormGroup({
      _id: new FormControl(null),
      paperId: new FormControl(
        this.selectedPaper.paper ? this.selectedPaper.paper["_id"] : null,
        Validators.required
      ),
      type: new FormControl(0, Validators.required),
      subjectId: new FormControl(
        this.selectedPaper.subject ? this.selectedPaper.subject["_id"] : null,
        Validators.required
      ),
      subCat: new FormControl(
        this.selectedPaper?.subject["subCat"]
          ? this.selectedPaper?.subject["subCat"][0]
          : "",
        Validators.required
      ),
      passage: new FormGroup({
        title: new FormControl(null, Validators.required),
        passageQuestion: new FormControl(null, Validators.required),
        passageText: new FormControl(null, Validators.required),
      }),
      questions: this.getQuestions(limit),
      // title: new FormControl(null, Validators.required),
      // passageQuestion: new FormControl(null, Validators.required),
      // passageText: new FormControl(null, Validators.required),
      // text: new FormControl(null, Validators.required),
      // marks: new FormControl(null, Validators.required),
      // result: new FormControl(null, Validators.required),
      // options: new FormArray([]),
      // subCat: new FormArray([]),
    });
    if (this.selectedPaper.subject && this.selectedPaper.subject["_id"]) {
      this.subjectOption(this.selectedPaper.subject["_id"]);
    }
  }

  getAllSubjects(entityType?: string) {
    const query = { entityType: entityType || this.entityType };
    this.testService.getAllSubject(query).subscribe(
      (response) => {
        this.subjects = response.data;
      },
      (error) => {
        this.toastr.error(error.error.message, "find Failed", {
          timeOut: 3000,
        });
      }
    );
  }

  subjectOption(subOpt) {
    this.subjects.map((sub) => {
      if (sub._id === subOpt) {
        this.subjectSubcat = sub.subCat;
      }
    });
  }
  pasageOption(selectVal) {
    if (parseInt(selectVal, 0) === 1) {
      this.passageFlag = true;
      return;
    }
    this.passageFlag = false;
  }
  passageQuestions(passageQuestions, title) {
    this.prepareQuestions(passageQuestions);
    this.questionsFormArray = this.questionPapersForm.controls
      .questions as FormArray;
    this.questionPapersForm.patchValue({
      type: 1,
      passage: {
        title,
        passageQuestion: passageQuestions,
      },
    });
  }

  addsubPaper() {
    this.paperModel.subject = this.paperModel.subject || [];

    this.paperModel.subject.push({
      subjectId: "",
      time: "",
    });
  }
  onDeleteSubPaper(index: number) {
    this.paperModel.subject.splice(index, 1);
  }
  addPaper() {
    this.showPaperFlag = true;
    this.addPaperFlag = true;
    this.addsubPaper();
  }
  showPaper() {
    this.showPaperFlag = true;
    this.addPaperFlag = false;
    this.questionPaperEditFlag = false;
    this.currentquestion = 0;
    this.totalquestion = 0;
  }

  submitPaper() {
    this.testService.addPaper(this.paperModel).subscribe(
      (data) => {
        this.getAllPaper();
        this.addPaperFlag = false;
        this.paperModel = {};
        this.toastr.success(data.message, "Test", {
          timeOut: 3000,
        });
      },
      (error) => {
        this.toastr.error(error.error.message, "Save Failed", {
          timeOut: 3000,
        });
      }
    );
  }

  public pageChange(event: any): void {
    this.paginationConfig.currentPage = event;
  }

  getAllPaper() {
    const query = {
      entityType: this.entityType,
    };
    this.testService.getAllPaper(query).subscribe(
      (response) => {
        // console.log("getAllPaper====", response.data);
        this.papers = response.data;
        this.paginationConfig.totalItems = this.papers.length;
      },
      (error) => {
        // console.log("error in fetch " + error);
        this.toastr.error(error.error.message, "find Failed", {
          timeOut: 3000,
        });
      }
    );
  }
  publishPaper(paper) {
    // console.log(paper);
    this.testService.updatePaper(paper).subscribe(
      () => {
        // console.log(response.data,paper);
        this.getAllPaper();
      },
      (error) => {
        // console.log("error in update " + error);
        this.toastr.error(error.error.message, "update Failed", {
          timeOut: 3000,
        });
      }
    );
  }

  addQuestion(paper, subject) {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
    this.passageFlag = false;
    this.showPaperFlag = false;
    this.questionPaperFlag = true;
    this.selectedPaper["paper"] = paper;
    this.selectedPaper["subject"] = subject;
    this.testService
      .getQuestions(
        { paperId: paper._id, subjectId: subject._id },
        { optionId: true }
      )
      .subscribe(
        (data) => {
          this.questionNum = 0;
          data.data.forEach((element) => {
            this.questionNum = this.questionNum + element.questions.length;
          });
          // console.log("data", data);
          this.prepareQuestions(1);
          this.questionsFormArray = this.questionPapersForm.controls
            .questions as FormArray;
        },
        (error) => {
          this.toastr.error(
            error.error.message,
            "error in getting questions count",
            {
              timeOut: 3000,
            }
          );
        }
      );
    this.getAllSubjects();
  }
  questionPaperSubmit() {
    let optionSelected = false;
    this.questionPapersForm.value.questions.forEach((question) => {
      question.options.forEach((option) => {
        if (option.selectedOption) {
          optionSelected = true;
        }
      });
    });

    if (!optionSelected) {
      this.toastr.error("Please select one option as selected option");
      return;
    }

    this.testService.addQuestions(this.questionPapersForm.value).subscribe(
      (data) => {
        // console.log(data.data.questions.length);
        if (this.questionPapersForm.value._id && this.questionPaperEditFlag) {
          if (this.totalquestion === this.currentquestion) {
            alert("No more questions remain");
            this.questionPaperEditFlag = false;
            return;
          }
          this.editQuestion(
            this.selectedPaper["paper"],
            this.selectedPaper["subject"]
          );
          return;
        } else {
          this.questionPaperEditFlag = false;
          this.questionNum += data.data.questions.length;
        }
        this.passageFlag = false;
        this.prepareQuestions(1);
        this.questionsFormArray = this.questionPapersForm.controls
          .questions as FormArray;
        this.toastr.success(data.message, "Test", {
          timeOut: 3000,
        });
      },
      (error) => {
        // console.log("error in Add " + error.error);
        this.toastr.error(error.error.message, "Save Failed", {
          timeOut: 3000,
        });
      }
    );
  }

  filteredQuestions(index) {
    //  this.questionArray = response.data;
    // if (this.totalquestion && this.totalquestion.length == 0) {
    //   return;
    // }
    // if (this.totalquestion == index) {
    //   this.currentquestion = 0;
    // }
    this.totalquestion = this.questionArray.length;
    const selectedelement = this.questionArray[index];
    this.questionNum = index;
    this.passageFlag = false;
    if (selectedelement && selectedelement.type === 1) {
      this.passageFlag = true;
    }
    this.prepareQuestions(selectedelement.questions.length);
    this.questionsFormArray = this.questionPapersForm.controls
      .questions as FormArray;
    this.questionPapersForm.setValue(selectedelement);
    // this.currentquestion++;
    // return this.questionArray;
  }
  editQuestion(paper, subject) {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
    this.questionPaperEditFlag = true;
    this.showPaperFlag = false;
    this.questionPaperFlag = true;
    // console.log(paper);
    // this.selectedPaper = paper;
    this.selectedPaper["paper"] = paper;
    this.selectedPaper["subject"] = subject;
    this.testService
      .getQuestions(
        { paperId: paper._id, subjectId: subject._id },
        { optionId: true }
      )
      .subscribe(
        (response) => {
          // console.log(response.data);
          // console.log(JSON.stringify(response.data));
          this.questionArray = response.data;
          this.totalquestion = this.questionArray.length;
          this.paginationQuestions = Array(this.totalquestion)
            .fill(1)
            .map(({}, i) => i);
          // const selectedelement = this.questionArray[this.currentquestion];
          if (response.data && response.data.length === 0) {
            return;
          }
          this.filteredQuestions(0);
          // this.questionNum = this.currentquestion;
          // this.passageFlag = false;
          // if (selectedelement && selectedelement.type == 1) {
          //   this.passageFlag = true;
          // }
          // this.prepareQuestions(selectedelement.questions.length);
          // this.questionsFormArray = this.questionPapersForm.controls
          //   .questions as FormArray;
          // this.questionPapersForm.setValue(selectedelement);
          // this.currentquestion++;
        },
        (error) => {
          console.log("error in update " + error);
          this.toastr.error(error.error.message, "update Failed", {
            timeOut: 3000,
          });
        }
      );
  }

  changeTestPaperDisabledStatus(testPaperId, isDisabled) {
    const query = {
      testPaperId,
      is_disabled: isDisabled,
    };

    this.testService.changeTestPaperDisabledStatus(query).subscribe(
      () => {
        this.getAllPaper();
      },
      (error) => {
        this.toastr.error(error.error.message, "Update Error", {
          timeOut: 3000,
        });
      }
    );
  }

  onPreview(paper: any) {
    this.router.navigate(["smart-student/start-test/preview", paper._id]);
  }

  public onDeleteConfirm(): void {
    this.testService.deleteTestpaper(this.selectedItem._id).subscribe(
      (response) => {
        this.getAllPaper();
        this.toastr.success(response.message, "Student", {
          timeOut: 3000,
        });
        this.onDeleteCancel();
      },
      (error: any) => {
        this.toastr.error(error.error, "Delete Failed", {
          timeOut: 3000,
        });
      }
    );
  }
  public onDeleteCancel() {
    $("#deleteModal").modal("toggle");
    this.selectedItem = null;
  }

  deleteTestpaper(paper: any) {
    this.selectedItem = paper;
    $("#deleteModal").modal({
      show: true,
    });
  }

  showAttemptedList(paper: any) {
    this.testService
      .getAttemptedUsers(paper._id)
      .subscribe((response: any) => {
        this.students = response.data;
        $("#viewStudentsModal").modal({
          show: true,
        });
      });
  }

  /**
   * onCancelViewStudents
   */
  public onCancelViewStudents() {
    $("#viewStudentsModal").modal("toggle");
    this.students = [];
  }
}
