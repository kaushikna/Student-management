// Angular
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

// Components Routing
import { TutorRoutingModule } from "./tutor-routing.module";
import { CommonModule } from "@angular/common";
import { ProfileComponent } from "../student/student-profile/student-profile.component";
import { CommonUtilsModule } from "../_common/common.module";
import { AdminModule } from "../admin/admin.module";


@NgModule({
  imports: [TutorRoutingModule, CommonModule, CommonUtilsModule, ReactiveFormsModule, FormsModule, AdminModule],
  declarations: [ProfileComponent]
})
export class TutorModule { }
