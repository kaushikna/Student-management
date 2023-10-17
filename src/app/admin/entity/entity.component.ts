import { Component, OnInit } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { EntityService } from "src/app/services/entity.service";
declare const $: any;

@Component({
  selector: "app-entity",
  templateUrl: "./entity.component.html",
  styleUrls: ["./entity.component.scss"],
})
export class EntityComponent implements OnInit {
  model: any = {};
  entities = false;
  constructor(
    private entityService: EntityService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.getEntities();
  }

  onClickAddEntity() {
    this.model = {};
    $("#addEntity").modal({
      show: true,
    });
  }

  onClickEditEntity(entity: any) {
    this.model = entity;
    $("#addEntity").modal({
      show: true,
    });
  }

  getEntities(cb?: any) {
    this.entityService.getEntities().subscribe(
      (response) => {
        this.entities = response.data;
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

  onSubmitEntity() {
    this.entityService.addEntity(this.model).subscribe(
      (data) => {
        this.model = {};
        this.getEntities();
        this.toastr.success(data.message, "Test", {
          timeOut: 3000,
        });
        $("#addEntity").modal("toggle");
      },
      (error) => {
        this.toastr.error(error.error.message, "Add Entity Failed", {
          timeOut: 3000,
        });
      }
    );
  }
}
