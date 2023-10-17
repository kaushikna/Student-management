import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { OrdersComponent } from "./student-orders/orders.component";
import { ProfileComponent } from "./student-profile/student-profile.component";
import { StudentTroublesComponent } from "./student-troubles/student-troubles.component";
import { StartTestComponent } from "../test-papers/start-test/start-test.component";
import { ResourceLibraryComponent } from "./resource-library/resource-library.component";
import { EventManagementComponent } from "../admin/events/event-management/event-management.component";
import { ViewTestpapersComponent } from "./view-test-paper/view-test-paper.component";
import { ViewChapterComponent } from "./view-chapter/view-chapter.component";
import { ViewResourceComponent } from "./view-resource/view-resource.component";
import { TestPaperResultDetailComponent } from "../test-papers/test-paper-result-detail/test-paper-result-detail.component";
import { PaymentmethodComponent } from "../paymentmethod/paymentmethod.component";
import { OderHistoryComponent } from "./oder-history/oder-history.component";
import { OrderHistoryDetailsComponent } from "./order-history-details/order-history-details.component";
import { StudHomeComponent } from "./stud-home/stud-home.component";
import { StudDashboardComponent } from "./stud-dashboard/stud-dashboard.component";

const route = "smart-student";

const routes: Routes = [
  {
    path: "",
    redirectTo: "stud_Home"
  },
  {
    path: "resource-library",
    component: ResourceLibraryComponent,
  },
  {
    path: "stud_Home",
    component: StudHomeComponent,
  },
  {
    path: "stud_Dashboad",
    component: StudDashboardComponent,
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
    path: "start-test/preview/:id",
    component: ViewTestpapersComponent,
  },
  {
    path: "start-test/:name",
    component: StartTestComponent,
  },
  {
    path: "result/:id",
    component: TestPaperResultDetailComponent,
  },
  {
    path: "profile",
    component: ProfileComponent,
  },
  {
    path: "events",
    component: EventManagementComponent,
  },
  {
    path: "orders",
    component: OrdersComponent,
  },
  {
    path: "troubles",
    component: StudentTroublesComponent,
  },
  {path:"payment-method",component:PaymentmethodComponent},
  {path:"order-history",component:OderHistoryComponent},
  {path:"order-history/order-histroy-detials",component:OrderHistoryDetailsComponent},
  {
    path: "**",
    redirectTo: route + "/profile"
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentsRoutingModule { }