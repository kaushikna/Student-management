// Angular
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

// Components Routing
import { AdminRoutingModule } from "./admin-routing.module";
import { CommonModule } from "@angular/common";
import { DashboardComponent } from "../dashboard/dashboard-main/dashboard.component";
import { TeacherManagementComponent } from "../teacher/teacher-management/teacher-management.component";
import { DashboardManagementComponent } from "../dashboard/dashboard-management/dashboard-management.component";
import { EventManagementComponent } from "./events/event-management/event-management.component";
import { TransactionsComponent } from "./transactions/transactions.component";
import { TroubleComponent } from "./troubles/troubles.component";
import { SubjectManagementComponent } from "../test-papers/subjects/subjects.component";
import { StudentManagementComponent } from "./student-management/student-management.component";
import { MyFilterPipe } from "../_shared/interfaces/pipes/filter.pipe";
import { MatButtonModule } from "@angular/material/button";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { NgbActiveModal, NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { SmartModalComponent } from "../utilities/smart-modal/smart-modal.component";
import { AddTeacherComponent } from "../teacher/add-teacher/add-teacher.component";
import { AddStudentComponent } from "../student/add-student/add-student.component";
import { CreateBatchComponent } from "./events/batch/create-batch/create-batch.component";
import { ScheduleClassesComponent } from "./events/schedule-classes/schedule-classes.component";
import { DropdownComponent } from "../utilities/dropdown/dropdown.component";
import { FroalaEditorModule } from "angular-froala-wysiwyg";
import { ChartsModule } from "ng2-charts";



import { OptionsPanelComponent } from "../test-papers/options-panel/options-panel.component";
import { QuestionPanelComponent } from "../test-papers/question-panel/question-panel.component";
import { MyISTPipe } from "../_shared/interfaces/pipes/date.pipe";
import { CommonUtilsModule } from "../_common/common.module";
import { NgxPaginationModule } from "ngx-pagination";
import { TestPaperManagementComponent } from "../test-papers/test-paper-management/test-paper-management.component";
import { TestPaperAssignComponent } from "../test-papers/assign-paper/assign-paper.component";
import { TutorTroublesComponent } from "../tutor/tutor-troubles/tutor-troubles.component";
import { DropDownSearchComponent } from "./search_dropdown/search_dropdown.component";
import { TestPaperResultComponent } from "../test-papers/test-paper-result/test-paper-result.component";
import { TestPaperResultDetailComponent } from "../test-papers/test-paper-result-detail/test-paper-result-detail.component";
import { EntityComponent } from "./entity/entity.component";
import { MenuComponent } from './menu/menu.component';
import { ApprovalsComponent } from "./approvals/approvals.component";
import { PieChartComponent } from './pie-chart/pie-chart.component';
import { AreaChartComponent } from './area-chart/area-chart.component';
import { BarChartComponent } from './bar-chart/bar-chart.component';
import { NgApexchartsModule } from "ng-apexcharts";
import { LineBarChartComponent } from './line-bar-chart/line-bar-chart.component';
import { EventcalanderComponent } from '../student/eventcalander/eventcalander.component';

import { AdminCalanderEventComponent } from './admin-calander-event/admin-calander-event.component';
import { FullCalendarModule } from 'ng-fullcalendar';

@NgModule({
  imports: [
    AdminRoutingModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatExpansionModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    NgbModule,
    CommonUtilsModule,
    NgxPaginationModule,
    ChartsModule,
    FroalaEditorModule.forRoot(),
    NgApexchartsModule,
   FullCalendarModule
  ],
  declarations: [
    MyFilterPipe,
    MyISTPipe,
    DropdownComponent,
    DashboardComponent,
    EventManagementComponent,
    TestPaperManagementComponent,
    SubjectManagementComponent,
    TroubleComponent,
    TutorTroublesComponent,
    TransactionsComponent,
    DashboardManagementComponent,
    StudentManagementComponent,
    TeacherManagementComponent,
    SmartModalComponent,
    AddTeacherComponent,
    AddStudentComponent,
    TestPaperAssignComponent,
    CreateBatchComponent,
    ScheduleClassesComponent,
    QuestionPanelComponent,
    OptionsPanelComponent,
    DropDownSearchComponent,
    TestPaperResultComponent,
    TestPaperResultDetailComponent,
    EntityComponent,
    MenuComponent,
    ApprovalsComponent,
    PieChartComponent,
    AreaChartComponent,
    BarChartComponent,
    LineBarChartComponent,
    EventcalanderComponent,
    AdminCalanderEventComponent
    

  ],
  providers: [
    NgbActiveModal
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA],
  exports: [EventManagementComponent, DropDownSearchComponent,
    SubjectManagementComponent, TestPaperManagementComponent, TestPaperAssignComponent]
})
export class AdminModule { }
