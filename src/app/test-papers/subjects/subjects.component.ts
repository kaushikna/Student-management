import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators, FormArray } from "@angular/forms";
import { TestPaperService } from "../../services/test-paper.service";
import { ToastrService } from "ngx-toastr";
import { SubjectModel } from "src/app/_shared/interfaces";
import { EntityService } from "src/app/services/entity.service";
declare const $: any;

@Component({
  selector: "app-test-paper-subjects",
  templateUrl: "./subjects.component.html",
  styleUrls: ["./subjects.component.scss"],
})
export class SubjectManagementComponent implements OnInit {
  constructor(
    public testService: TestPaperService,
    public toastr: ToastrService,
    public entityService: EntityService
  ) {}
  subjectForm: FormGroup | any;
  subject = null;
  entities = [];
  subjects = [];
  entityType: string;
  ngOnInit(): void {
    this.subjectForm = new FormGroup({
      name: new FormControl(null, Validators.required),
      entityType: new FormControl(null, Validators.required),
      subCat: new FormArray([]),
    });
    this.getEntities(() => this.getAllSubjects());
  }

  addsubCat() {
    const control = new FormControl(null, Validators.required);
    (this.subjectForm.get("subCat") as FormArray).push(control);
  }

  addSubjectModal() {
    this.subjectForm.setControl("subCat", new FormArray([]));
    this.subjectForm.setValue({ name: "", subCat: [], entityType: "" });
    this.openSubjectModal();
  }

  openSubjectModal() {
    $("#addSubject").modal({
      show: true,
    });
  }

  editSub(sub: SubjectModel) {
    this.subject = sub;
    sub.subCat.forEach(() => {
      this.addsubCat();
    });
    const subData = { ...sub };
    delete subData.status;
    delete subData._id;
    this.subjectForm.setValue(subData);
    this.openSubjectModal();
  }

  deletesubCat(i) {
    // this.subjectForm.controls.subCat["controls"] = [];
    this.subjectForm.controls.subCat.controls =
      this.subjectForm.controls.subCat.controls.filter(({}, index) => {
        return index !== i;
      });
    this.subjectForm.value.subCat = this.subjectForm.value.subCat.filter(
      ({}, index) => {
        return index !== i;
      }
    );
  }

  submitSubject() {
    const subObj = this.subjectForm.value;
    if (this.subject && this.subject._id) {
      subObj._id = this.subject._id;
    }
    this.testService.addSubject(subObj).subscribe(
      (data) => {
        // console.log(data);
        this.subject = null;
        this.getAllSubjects();
        this.subjectForm.reset();
        this.subjectForm.controls.subCat.controls = [];
        this.toastr.success(data.message, "Test", {
          timeOut: 3000,
        });
        $("#addSubject").modal("toggle");
      },
      (error) => {
        // console.log("error in Add " + error);
        this.toastr.error(error.error.message, "Save Failed", {
          timeOut: 3000,
        });
      }
    );
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

  getEntities(cb?: any) {
    this.entityService.getEntities().subscribe(
      (response) => {
        this.entities = response.data;
        this.entityType = this.entities[0].value;
        if (cb) {
          cb();
        }
      },
      (error) => {
        this.toastr.error(error.error.message, "find Failed", {
          timeOut: 3000,
        });
      }
    );
  }

  public onClickDelete(subject: any) {
    this.subject = subject;
    $("#deleteModal").modal({
      show: true,
    });
  }

  public onDeleteConfirm(): void {
    this.testService.deleteSubject(this.subject).subscribe(
      (response) => {
        this.getAllSubjects();
        this.toastr.success(response.message, "Subject", {
          timeOut: 3000,
        });
        this.onDeleteCancel();
      },
      (error) => {
        this.toastr.error(error.error, "Delete Failed", {
          timeOut: 3000,
        });
      }
    );
  }
  public onDeleteCancel() {
    $("#deleteModal").modal("toggle");
    this.subject = null;
  }
}
