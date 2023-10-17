import { Component, OnInit } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { ApprovalService } from "src/app/services/approval.service";
declare const $: any;

@Component({
  selector: "app-approvals",
  templateUrl: "./approvals.component.html",
  styleUrls: ["./approvals.component.css"],
})
export class ApprovalsComponent implements OnInit {
  constructor(
    public toastr: ToastrService,
    public approvalService: ApprovalService
  ) {}
  approvals = [];

  ngOnInit(): void {
    this.getApprovals();
  }

  approveParent(userId) {
    this.approvalService.approveParent({ userId }).subscribe(
      (data) => {
        this.getApprovals();
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

  getApprovals() {
    this.approvalService.getAllApprovals().subscribe(
      (response) => {
        this.approvals = response.data;
      },
      (error) => {
        this.toastr.error(error.error.message, "find Failed", {
          timeOut: 3000,
        });
      }
    );
  }
}
