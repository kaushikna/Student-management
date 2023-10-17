import { Component, OnInit, ViewChild } from "@angular/core";
import { SmartModalComponent } from "../../utilities/smart-modal/smart-modal.component";
import { TeacherService } from "../../services/teacher.service";
import { ToastrService } from "ngx-toastr";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { TestPaperService } from "src/app/services/test-paper.service";
import { CommonService } from "src/app/services/common.service";
import { PaginationInstance } from "ngx-pagination";
import { Subject } from "rxjs";
declare const $: any;

export const TeacherStatusConstants = {
  APPROVED: "approved",
  REJECTED: "rejected",
};

@Component({
  selector: "app-teacher-management",
  templateUrl: "./teacher-management.component.html",
  styleUrls: ["./teacher-management.component.css"],
})
export class TeacherManagementComponent implements OnInit {
  teacher: any = {};
  selectedItem: any = {};
  model: any = {
    data: [],
  };
  teacherStatusConstants: any = TeacherStatusConstants;
  public subjectList: any[];
  modalTitle = "Add Teacher";
  searchString = "";
  form: FormGroup = null;
  public formHandle: Subject<any> = new Subject();

  @ViewChild(SmartModalComponent, { static: true })
  private modal: SmartModalComponent;
  public paginationConfig: PaginationInstance = {
    id: "paginationListId",
    itemsPerPage: 5,
    currentPage: 1,
    totalItems: this.model.data.length,
  };

  constructor(
    private teacherService: TeacherService,
    private testService: TestPaperService,
    private commonService: CommonService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService
  ) {}

  onClickAdd() {
    this.modalTitle = "Add Teacher";
    this.teacher = {};
    this.createForm();
    this.modal.open("xl");
    setTimeout(() => {
      this.formHandle.next({ action: "INIT", value: true });
    });
  }

  public pageChange(event: any): void {
    this.paginationConfig.currentPage = event;
    this.loadData();
  }

  public refreshData(): void {
    this.paginationConfig.currentPage = 1;
    this.paginationConfig.itemsPerPage = 5;
  }

  public onEntityClick(item: any): void {
    this.selectedItem = item;
    $("#teacher-details").modal({
      show: true,
    });
  }
  public closeModal() {
    $("#teacher-details").modal("toggle");
    this.selectedItem = null;
  }

  createForm() {
    const dateOfBirth = this.teacher.dateOfBirth
      ? this.commonService.getDate(this.teacher.dateOfBirth)
      : null;

    this.form = this.formBuilder.group({
      _id: [this.teacher._id],
      firstName: [
        this.teacher.firstName,
        [Validators.required, Validators.minLength(3)],
      ],
      lastName: [
        this.teacher.lastName,
        [Validators.required, Validators.minLength(3)],
      ],
      email: [this.teacher.email, [Validators.required, Validators.email]],
      mobileNo: [
        this.teacher.mobileNo,
        [Validators.required, Validators.minLength(14)],
      ],
      qualification: [this.teacher.qualification, Validators.required],
      dateOfBirth: [dateOfBirth, Validators.required],
      avatar: [this.teacher.avatar],
      gender: [this.teacher.gender, Validators.required],
      subjects: this.getSubjectsArray(this.subjectList, this.teacher.subjects),
      availableFrom: [
        this.commonService.getDate(this.teacher.availableFrom),
        Validators.required,
      ],
      address: [this.teacher.address, Validators.required],
      city: [this.teacher.city, Validators.required],
      state: [this.teacher.state, Validators.required],
      country: [this.teacher.country, Validators.required],
      zip: [
        this.teacher.zip,
        [Validators.required, Validators.pattern("[0-9]{5,6}$")],
      ],
      summary: [this.teacher.summary],
    });
  }

  updateTeacher(st) {
    this.modalTitle = "Update Teacher";
    this.teacher = st;
    this.createForm();
    this.modal.open("xl");
    setTimeout(() => {
      this.formHandle.next({ action: "UPDATE", value: true });
    });
  }
  ngOnInit() {
    this.loadData();
    this.getAllSubjects(() => {});
  }

  getSubjectsArray(subjectsList: any[], subjects: any[]) {
    subjects = subjects || [];
    const arr = subjectsList.map((subjectsListItem) => {
      const subjectExists = subjects.find(
        (subjectItem: any) => subjectItem._id === subjectsListItem._id
      );
      return new FormControl(!!subjectExists);
    });
    return new FormArray(arr);
  }

  getAllSubjects(callback: any) {
    this.testService.getAllSubject({ entityType: "all" }).subscribe(
      (response) => {
        this.subjectList = response.data;
        callback();
      },
      () => {
        this.subjectList = [];
      }
    );
  }

  loadData() {
    const query = {
      page: this.paginationConfig.currentPage,
      pageSize: this.paginationConfig.itemsPerPage,
      searchString: this.searchString,
    };
    this.teacherService.getTeachers(query).subscribe((response) => {
      this.model.data = response.data.map((dataItem: any, index: number) => {
        dataItem.avatar = dataItem.avatar || "/assets/images/profile.svg";
        dataItem.index =
          index +
          1 +
          this.paginationConfig.itemsPerPage *
            (this.paginationConfig.currentPage - 1);
        return dataItem;
      });
      this.paginationConfig.totalItems = response.total || response.data.length;
    });
  }

  addTeacher(data) {
    if (!data.teacher._id) {
      this.teacherService.addTeacher(data.teacher).subscribe(
        (response) => {
          this.loadData();
          this.toastr.success(response.responseText, "Student", {
            timeOut: 3000,
          });
          this.modal.close();
        },
        (error) => {
          this.modal.close();
          console.log("error in add " + error.error.message);
          this.toastr.error(error.error.message, "Teacher", {
            timeOut: 3000,
          });
        }
      );
    } else {
      this.teacherService.updateTeacher(data.teacher).subscribe(
        (response) => {
          this.loadData();
          this.toastr.success(response.responseText, "Teacher", {
            timeOut: 3000,
          });
          this.modal.close();
        },
        (error) => {
          this.modal.close();
          console.log("error in update " + error.error.message);
          this.toastr.error(error.error.message, "Teacher", {
            timeOut: 3000,
          });
        }
      );
    }
  }

  approve(dataObj: any, flag: boolean) {
    const status = flag
      ? TeacherStatusConstants.APPROVED
      : TeacherStatusConstants.REJECTED;
    const { _id } = dataObj;
    this.teacherService.updateTeacher({ _id, status }).subscribe(
      (response) => {
        this.loadData();
        this.toastr.success(response.responseText, "Teacher", {
          timeOut: 3000,
        });
      },
      (error) => {
        console.log("error in update " + error.error.message);
        this.toastr.error(error.error.message, "Teacher", {
          timeOut: 3000,
        });
      }
    );
  }

  public deleteTeacher(st) {
    this.selectedItem = st;
    $("#deleteModal").modal({
      show: true,
    });
  }

  public onDeleteConfirm(): void {
    this.teacherService.deleteTeacher(this.selectedItem.teacherId).subscribe(
      (response) => {
        this.loadData();
        this.toastr.success(response.message, "Teacher", {
          timeOut: 3000,
        });
        this.onDeleteCancel();
      },
      (error) => {
        console.log("error in update " + error.error.message);
        this.toastr.error(error.error.message, "Teacher", {
          timeOut: 3000,
        });
      }
    );
  }
  public onDeleteCancel() {
    $("#deleteModal").modal("toggle");
    this.selectedItem = null;
  }

  public onStatusChange(item: any): void {
    const { isActive, _id } = item;
    this.teacherService.updateTeacher({ _id, isActive }).subscribe(
      (response) => {
        this.toastr.success(response.responseText, "Teacher", {
          timeOut: 3000,
        });
      },
      (error) => {
        console.log("error in update " + error.error.message);
        this.toastr.error(error.error.message, "Teacher", {
          timeOut: 3000,
        });
      }
    );
  }
}
