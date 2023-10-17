import { Component, OnInit } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { MenuService } from "src/app/services/menu.service";
declare const $: any;

@Component({
  selector: "app-menu",
  templateUrl: "./menu.component.html",
  styleUrls: ["./menu.component.css"],
})
export class MenuComponent implements OnInit {
  constructor(public toastr: ToastrService, public menuService: MenuService) {}
  model: any = {
    roles: [],
  };
  menus = [];
  selectedRole = "";
  roles = ["admin", "student", "tutor", "parent"];

  ngOnInit(): void {
    this.getMenus();
  }

  addMenuModal() {
    this.model = {
      roles: [],
    };
    this.openAddMenuModal();
  }

  openAddMenuModal() {
    $("#addMenu").modal({
      show: true,
    });
  }

  onRoleRemove(i) {
    this.model.roles.splice(i, 1);
  }

  onRoleAdd() {
    const roleExists = this.model?.roles?.find(
      (roleItem) => roleItem === this.selectedRole
    );
    if (!roleExists) {
      this.model.roles.push(this.selectedRole);
    } else {
      this.toastr.error("Already Added", "Error", {
        timeOut: 3000,
      });
    }
  }

  onEditMenu(menu: any) {
    this.model = menu;
    this.openAddMenuModal();
  }

  submitAddMenu() {
    if (!this.model._id) {
      this.menuService.addMenu(this.model).subscribe(
        (data) => {
          this.model = {};
          this.getMenus();
          this.toastr.success(data.message, "Test", {
            timeOut: 3000,
          });
          $("#addMenu").modal("toggle");
        },
        (error) => {
          this.toastr.error(error.error.message, "Save Failed", {
            timeOut: 3000,
          });
        }
      );
    } else {
      this.menuService.updateMenu(this.model).subscribe(
        (data) => {
          this.model = {};
          this.getMenus();
          this.toastr.success(data.message, "Test", {
            timeOut: 3000,
          });
          $("#addMenu").modal("toggle");
        },
        (error) => {
          this.toastr.error(error.error.message, "Save Failed", {
            timeOut: 3000,
          });
        }
      );
    }
  }


  getMenus() {
    this.menuService.getAllMenus().subscribe(
      (response) => {
        this.menus = response.data;
      },
      (error) => {
        this.toastr.error(error.error.message, "find Failed", {
          timeOut: 3000,
        });
      }
    );
  }
}
