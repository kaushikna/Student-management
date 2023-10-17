
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { DashboardComponent } from "../dashboard/dashboard-main/dashboard.component";
import { EventManagementComponent } from "./events/event-management/event-management.component";

import { StudentManagementComponent } from "./student-management/student-management.component";
import { TeacherManagementComponent } from "../teacher/teacher-management/teacher-management.component";
import { SubjectManagementComponent } from "../test-papers/subjects/subjects.component";
import { TransactionsComponent } from "./transactions/transactions.component";
import { TroubleComponent } from "./troubles/troubles.component";
import { ResourceLibraryComponent } from "../student/resource-library/resource-library.component";
import { OrdersComponent } from "../student/student-orders/orders.component";
import { TestPaperManagementComponent } from "../test-papers/test-paper-management/test-paper-management.component";
import { TestPaperAssignComponent } from "../test-papers/assign-paper/assign-paper.component";
import { ViewResourceComponent } from "../student/view-resource/view-resource.component";
import { ViewChapterComponent } from "../student/view-chapter/view-chapter.component";
import { TestPaperResultComponent } from "../test-papers/test-paper-result/test-paper-result.component";
import { TestPaperResultDetailComponent } from "../test-papers/test-paper-result-detail/test-paper-result-detail.component";
import { EntityComponent } from "./entity/entity.component";
import { MenuComponent } from "./menu/menu.component";
import { ApprovalsComponent } from "./approvals/approvals.component";
const route = "admin";

const routes: Routes = [

  {
    path: "",
    redirectTo: "dashboard"
  },
  {
    path: "dashboard",
    component: DashboardComponent,
  },
  {
    path: "teacher-management",
    component: TeacherManagementComponent,
  },
  {
    path: "student-management",
    component: StudentManagementComponent,
  },
  {
    path: "event-management",
    component: EventManagementComponent,
  },
  {
    path: "resource-library",
    component: ResourceLibraryComponent,
  },
  {
    path: "resource-library/:id",
    component: ViewResourceComponent,
  },
  {
    path: "resource-library/:id/chapters",
    component: ViewChapterComponent,
  },
  {
    path: "orders",
    component: OrdersComponent,
  },
  {
    path: "transactions",
    component: TransactionsComponent,
  },
  { path: "menus", component: MenuComponent },
  { path: "approvals", component: ApprovalsComponent },
  { path: "subjects", component: SubjectManagementComponent },
  { path: "testpapers", component: TestPaperManagementComponent },
  { path: "results/:id", component: TestPaperResultDetailComponent },
  { path: "results", component: TestPaperResultComponent },
  { path: "assign", component: TestPaperAssignComponent },
  { path: "examtypes", component: EntityComponent },

  {
    path: "troubles",
    component: TroubleComponent,
  },
  {
    path: "",
    redirectTo: "dashboard"
  },
  {
    path: "**",
    redirectTo: route + "/dashboard"
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
