import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { EventManagementComponent } from "../admin/events/event-management/event-management.component";
import { ResourceLibraryComponent } from "../student/resource-library/resource-library.component";
import { ProfileComponent } from "../student/student-profile/student-profile.component";
import { TutorTroublesComponent } from "./tutor-troubles/tutor-troubles.component";

const route = "smart-student";

const routes: Routes = [
  {
    path: "",
    redirectTo: "profile"
  },
  {
    path: "event-management",
    component: EventManagementComponent,
  },
  {
    path: "profile",
    component: ProfileComponent,
  },
  {
    path: "resource-library",
    component: ResourceLibraryComponent,
  },
  {
    path: "troubles",
    component: TutorTroublesComponent,
  },
  {
    path: "**",
    redirectTo: route + "/profile"
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TutorRoutingModule { }
