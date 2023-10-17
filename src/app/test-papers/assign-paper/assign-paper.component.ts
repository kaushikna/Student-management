import { Component, OnInit } from "@angular/core";
import { TestPaperService } from "../../services/test-paper.service";
import { PaginationInstance } from "ngx-pagination";
import { Subject } from "rxjs";
import { ToastrService } from "ngx-toastr";
import { EventService } from "src/app/services/event.service";
import { plans as PLANS } from "../../metaData/metaData";
import { StudentService } from "src/app/services/student.service";
import { EntityService } from "src/app/services/entity.service";
declare const $: any;

@Component({
  selector: "app-assign-paper",
  templateUrl: "./assign-paper.component.html",
  styleUrls: ["./assign-paper.component.scss"],
})
export class TestPaperAssignComponent implements OnInit {
  public BatchId: any;
  public TestPaperId: any;
  public entityType: string;
  public attemptCount = 0;
  public students = [];
  public studentList = [];
  public entities = [];
  public papers = [];
  public batches = [];
  public filterTrigger = new Subject();
  public list = [];
  public paper = [];
  public paginationConfig: PaginationInstance = {
    id: "paginationListId",
    itemsPerPage: 5,
    currentPage: 1,
    totalItems: this.list.length,
  };

  constructor(
    private testService: TestPaperService,
    private eventService: EventService,
    private studentService: StudentService,
    private entityService: EntityService,
    private toastr: ToastrService
  ) {}
  ngOnInit(): void {
    this.getEntities(() => {
      this.getTestpapers();
      this.getBatches();
      this.loadData();
    });
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

  getTestpapers() {
    this.papers = [];
    this.testService
      .getAllPaper({
        publish: true,
        active: true,
        type: "General",
        entityType: this.entityType,
      })
      .subscribe((response: any) => {
        this.papers = response.data;
      });
  }

  onExamTypeChange() {
    this.getTestpapers();
    this.getBatches();
    this.loadData();
  }

  getBatches() {
    this.batches = [];
    const entityData = this.entities.find((entity: any) => {
      return entity.code === this.entityType;
    });

    this.eventService
      .getAllBatch({}, { pageSize: 1000, entityId: entityData._id })
      .subscribe((response: any) => {
        this.batches = response.data.map((element) => {
          if (element.plan === 1) {
            element.batchName =
              element.batchName +
              " (" +
              element?.student?.firstName +
              " " +
              element?.student?.lastName +
              ")";
          }
          return element;
        });
      });
  }

  public onFilterClicked(event: any) {
    this.filterTrigger.next({ type: "TRIGGER", key: event });
  }

  public applySelectedOption(event: any) {
    const { key, value } = event;
    if (key === "Testpaper") {
      this.TestPaperId = value;
    }
    if (key === "Batch") {
      this.BatchId = value;
    }
    this.filterTrigger.next({ type: "APPLY", key, value });
  }

  refreshKeys() {
    this.BatchId = {};
    this.TestPaperId = {};
    this.filterTrigger.next({ type: "APPLY", key: "Batch", value: {} });
    this.filterTrigger.next({ type: "APPLY", key: "Testpaper", value: {} });
    this.attemptCount = 0;
  }

  get_search_result(event) {
    const searchQuery = event.target.value;
    const query = {
      BatchId: this.BatchId,
      search_query: searchQuery,
    };
    if (!searchQuery) {
      this.students = [];
    } else {
      this.testService.getStudentBySearchQuery(query).subscribe(
        (response) => {
          this.students = response;
        },
        (error) => {
          this.toastr.error(error.error.message, "Update Error", {
            timeOut: 3000,
          });
        }
      );
    }
  }

  addStudentOrBatchToTestPaper() {
    const query = {
      batchId: this.BatchId._id,
      testPaperId: this.TestPaperId._id,
    };

    this.testService.addStudentOrBatchToTestPaper(query).subscribe(
      () => {
        this.refreshKeys();
        this.loadData();
        this.toastr.success("Assigned Successfully");
      },
      (error) => {
        this.refreshKeys();
        this.toastr.error(error.error.message, "Update Error", {
          timeOut: 3000,
        });
      }
    );
  }

  deAssignTestpaper(record) {
    const query = {
      batchId: record.batch._id,
      testPaperId: record._id,
    };
    this.testService.removeStudentOrBatchFromTestPaper(query).subscribe(
      () => {
        this.toastr.success("De Assigned Successfully");
        this.loadData();
        this.onDeleteCancel();
      },
      (error) => {
        this.refreshKeys();
        this.toastr.error(error.error.message, "Update Error", {
          timeOut: 3000,
        });
      }
    );
  }

  public pageChange(event: any): void {
    this.paginationConfig.currentPage = event;
    this.loadData();
  }

  loadData() {
    const query = {
      page: this.paginationConfig.currentPage,
      pageSize: this.paginationConfig.itemsPerPage,
      entityType: this.entityType,
    };
    this.testService
      .getAllPapersAssigned({ searchQuery: "" }, query)
      .subscribe((response: any) => {
        this.list = response.data.map((record) => {
          record.status = record.is_disabled ? "Disabled" : "Enabled";
          if (record.batch.plan === PLANS[0].id) {
            record.batchName = record.batch.student
              ? record.batch.student.firstName +
                " " +
                record.batch.student.lastName
              : "";
          } else {
            record.batchName = record.batch.batchName;
          }

          return record;
        });
        this.paginationConfig.totalItems =
          response.total || response.data.length;
      });
  }

  public viewStudents(batchId: any) {
    this.studentService
      .getStudentList({ batchId })
      .subscribe((response: any) => {
        this.studentList = response.map((element: any) => {
          element.fullName = element.firstName + " " + element.lastName;
          return element;
        });
        $("#viewStudentsModal").modal({
          show: true,
        });
      });
  }

  /*
   * onCancelViewStudents
   */

  public onCancelViewStudents() {
    $("#viewStudentsModal").modal("toggle");
    this.students = null;
  }

  public onClickDeassign(item) {
    this.paper = item;
    $("#deleteModal").modal({
      show: true,
    });
  }

  public onDeleteConfirm(): void {
    this.deAssignTestpaper(this.paper);
  }

  public onDeleteCancel() {
    $("#deleteModal").modal("toggle");
    this.paper = null;
  }
}
