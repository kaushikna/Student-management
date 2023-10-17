import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { PaginationInstance } from "ngx-pagination";
import { ToastrService } from "ngx-toastr";
import { Subject } from "rxjs";
import { Role } from "src/app/Models/role";
import { AuthService } from "src/app/services/auth.service";
import { EntityService } from "src/app/services/entity.service";
import { TestPaperService } from "src/app/services/test-paper.service";

@Component({
  selector: "app-test-paper-result",
  templateUrl: "./test-paper-result.component.html",
  styleUrls: ["./test-paper-result.component.css"],
})
export class TestPaperResultComponent implements OnInit {
  testPaperQuery: any = {};
  testPaperTypes: any[] = [];
  subjects: any[] = [];
  entities: any[] = [];
  students: any[] = [];
  statuses: any[] = [];
  statusesList: any[] = [
    {
      title: "Pending",
      value: 0,
    },
    {
      title: "Completed",
      value: 1,
    },
  ];
  testResults: any[] = [];

  public paginationConfig: PaginationInstance = {
    id: "paginationListId",
    itemsPerPage: 6,
    currentPage: 1,
    totalItems: 0,
  };
  public filterTrigger = new Subject();
  public loading = false;
  public filters: any = [
    {
      title: "Types",
      roles: [Role.ADMIN, Role.STUDENT, Role.TUTOR],
    },
    {
      title: "Entities",
      roles: [Role.ADMIN, Role.TUTOR],
    },
    {
      title: "Students",
      roles: [Role.ADMIN, Role.TUTOR],
    },
    {
      title: "Subjects",
      roles: [Role.STUDENT],
    },
    {
      title: "Status",
      roles: [Role.STUDENT],
    },
  ];
  currentUser: any = {};
  filterFlagObj: any = {};

  constructor(
    private testService: TestPaperService,
    private entityService: EntityService,
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getUser();
    const testPaperTypesTask: any = this.testService.getTestPaperTypes();
    const entitiesTask: any = this.entityService.getEntities();
    const studentsTask: any = this.testService.getStudents();
    const statusTask: any = Promise.resolve(this.statusesList);

    this.testPaperQuery.status = 1;

    this.filters.forEach((filter: any) => {
      const roleExists = filter.roles.includes(this.currentUser.role);
      if (roleExists) {
        const { title } = filter;
        if (title === "Types") {
          testPaperTypesTask.subscribe((response) => {
            this.testPaperTypes = response.data;
            this.testPaperQuery.type = this.testPaperTypes[0].value;
          });
        }
        if (title === "Students") {
          studentsTask.subscribe((response) => {
            this.students = response.data;
          });
        }
        if (title === "Entities") {
          entitiesTask.subscribe((response) => {
            this.entities = response.data;
            this.testPaperQuery.entityType = this.entities[0].value;
            this.getAllSubjects();
          });
        }
        if (title === "Status") {
          statusTask.then((response) => {
            this.statuses = response;
          });
        }
        if (title === "Subjects") {
          this.getAllSubjects();
        }
      }
      this.filterFlagObj[filter.title] = roleExists;
    });
  }

  public loadData() {
    const search = this.testPaperQuery.search?.trim();
    if (search && search.length <= 3) {
      return;
    }

    this.loading = true;
    const query = {
      ...this.testPaperQuery,
      pageNo: this.paginationConfig.currentPage,
      pageSize: this.paginationConfig.itemsPerPage,
    };

    this.testResults = [];
    this.paginationConfig.totalItems = 0;

    this.testService.getTestResults(query).subscribe((response) => {
      this.testResults = response.data.data;
      this.paginationConfig.totalItems = response.data.total;
      this.loading = false;
    });
  }

  public refreshData(): void {
    if (this.currentUser.role !== Role.STUDENT && !this.testPaperQuery.studentId) {
      return;
    }

    this.paginationConfig.currentPage = 1;
    this.paginationConfig.itemsPerPage = 6;
    this.loadData();
  }

  public pageChange(event: any): void {
    this.paginationConfig.currentPage = event;
    this.loadData();
  }

  public onFilterClicked(event: any) {
    this.filterTrigger.next({ type: "TRIGGER", key: event });
  }

  public applySelectedOption(event: any) {
    const { key, value } = event;
    if (key === "Student") {
      this.testPaperQuery.studentId = value._id;
      this.refreshData();
    }
    this.filterTrigger.next({ type: "APPLY", key, value });
  }

  public onStartExam(item: any): void {
    this.router.navigate(["smart-student/start-test/preview", item._id]);
  }

  public onExamTypeChange() {
    this.getAllSubjects();
  }

  public getAllSubjects(entityType?: string) {
    const query = { entityType: entityType || this.testPaperQuery.entityType };
    this.testService.getAllSubject(query).subscribe(
      (response) => {
        this.subjects = response.data;
        this.testPaperQuery.subjectId = this.subjects[0]._id;
        if (
          this.currentUser.role === Role.STUDENT ||
          this.testPaperQuery.studentId
        ) {
          this.loadData();
        }
      },
      (error) => {
        this.toastr.error(error.error.message, "find Failed", {
          timeOut: 3000,
        });
      }
    );
  }
}
