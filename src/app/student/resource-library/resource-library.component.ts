import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { PaginationInstance } from "ngx-pagination";
import { ToastrService } from "ngx-toastr";
import { Role } from "src/app/Models";
import { AuthService } from "src/app/services/auth.service";
import { EntityService } from "src/app/services/entity.service";
import { ResourceService } from "src/app/services/resource.service";
import { TestPaperService } from "src/app/services/test-paper.service";
import { ModalConfig } from "src/app/utilities/smart-modal2/modal.config";
import { SmartModal2Component } from "src/app/utilities/smart-modal2/smart-modal2.component";

declare const $: any;

@Component({
  selector: "app-resource-library",
  templateUrl: "./resource-library.component.html",
  styleUrls: ["./resource-library.component.css"],
})
export class ResourceLibraryComponent implements OnInit {
  currentUser: any;
  public entities: any = [];
  public subjects: any = [];
  public resources: any = [];
  public paginationConfig: PaginationInstance = {
    id: "paginationListId",
    itemsPerPage: 5,
    currentPage: 1,
    totalItems: 0,
  };
  model: any = {};
  resource: any = {};
  preview1: any = {};
  searchQuery = "";
  submitted = false;
  addButton = false;

  @ViewChild("modal1") private modal: SmartModal2Component;
  @ViewChild("modal2") private modal2: SmartModal2Component;
  public addResourceConfig: ModalConfig = {
    modalTitle: "Add Resource",
    size: "lg",
  };
  public editResourceConfig: ModalConfig = {
    modalTitle: "Edit Resource",
    size: "lg",
  };
  public resourceModel: any = {};
  public entityType: string;
  public entitiesFlag = false;

  constructor(
    private authService: AuthService,
    public entityService: EntityService,
    public toastr: ToastrService,
    public router: Router,
    private testPaperService: TestPaperService,
    private resourceService: ResourceService
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getUser();
    this.entitiesFlag = this.currentUser.role !== Role.STUDENT;
    this.getEntities();
  }

  public loadData() {
    const query = {
      pageNo: this.paginationConfig.currentPage,
      pageSize: this.paginationConfig.itemsPerPage,
      searchQuery: this.searchQuery,
      entityType: this.entityType,
    };
    this.resourceService.getAllResources(query).subscribe((response) => {
      this.resources = response.data;
      this.addButton = response.addButton;
      this.paginationConfig.totalItems = response.total;
    });
  }

  public refreshData(): void {
    this.paginationConfig.currentPage = 1;
    this.paginationConfig.itemsPerPage = 6;
    this.loadData();
  }

  public pageChange(event: any): void {
    this.paginationConfig.currentPage = event;
    this.loadData();
  }

  public createResource(): void {
    this.resourceService.addResource(this.resourceModel).subscribe(
      () => {
        this.resourceModel = {};
        this.toastr.success("Resource created successfully", "Resource", {
          timeOut: 3000,
        });
        this.modal.close();
        this.resourceModel = {};
        this.refreshData();
      },
      ({ error }) => {
        this.toastr.error(error.title, "Resource", {
          timeOut: 3000,
        });
      }
    );
  }

  public editResource(): void {
    this.resourceService.editResource(this.resourceModel).subscribe(
      () => {
        this.toastr.success("Resource updated successfully", "Resource", {
          timeOut: 3000,
        });
        this.modal2.close();
        this.resourceModel = {};
        this.loadData();
      },
      ({ error }) => {
        this.toastr.error(error.title, "Resource", {
          timeOut: 3000,
        });
      }
    );
  }

  /**
   * getAllSubjects
   */
  public getAllSubjects(cb?: any) {
    const query = { entityType: this.resourceModel.entityType };
    this.testPaperService.getAllSubject(query).subscribe((response: any) => {
      this.subjects = response.data;
      if (cb) {
        cb();
      }
    });
  }

  getEntities() {
    this.entityService.getEntities().subscribe(
      (response) => {
        this.entities = response.data;
        this.entityType = this.entities[0].value;
        this.refreshData();
      },
      (error) => {
        this.toastr.error(error.error.message, "find Failed", {
          timeOut: 3000,
        });
      }
    );
  }

  public onExamTypeChange() {
    this.getAllSubjects(() => {
      this.resourceModel.subjectId = this.subjects[0]._id;
    });
  }

  public openAddResource() {
    this.resourceModel = {};
    this.subjects = [];
    this.resourceModel.entityType = this.entities[0]?.value;
    this.getAllSubjects(() => {
      this.resourceModel.subjectId = this.subjects[0]._id;
    });
    this.modal.open();
  }

  public openEditResource(entity: any): void {
    this.resourceModel = { ...entity };
    this.subjects = [];
    this.getAllSubjects();
    this.modal2.open();
  }

  /**
   * download
   */
  public download(resource: any) {
    const URL = resource.fileUrl;
    const link = document.createElement("a");
    link.download = URL.split("/")[0];
    link.href = URL;
    link.setAttribute("target", "_blank");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    // delete link;
  }

  public onClickViewResource(resource: any) {
    const route = this.currentUser.route;
    this.router.navigate([route, "resource-library", resource._id]);
  }

  public openDeleteResource(resource: any) {
    this.resource = { ...resource };
    $("#deleteModal").modal({
      show: true,
    });
  }

  public onDeleteConfirm(): void {
    this.resourceService.deleteResource(this.resource).subscribe(
      (response) => {
        this.resourceModel = {};
        this.loadData();
        this.toastr.success(response.message, "Resource", {
          timeOut: 3000,
        });
        this.onDeleteCancel();
      },
      ({ error }) => {
        this.toastr.error(error, "Resource", {
          timeOut: 3000,
        });
      }
    );
  }
  public onDeleteCancel() {
    $("#deleteModal").modal("toggle");
    this.resource = null;
  }
}
