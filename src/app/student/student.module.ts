// Angular
import { NgModule } from "@angular/core";
import { ProfileComponent } from "./student-profile/student-profile.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

// Components Routing
import { StudentsRoutingModule } from "./student-routing.module";
import { CommonModule } from "@angular/common";
import { StudentTroublesComponent } from "./student-troubles/student-troubles.component";
import { NgxPaginationModule } from "ngx-pagination";
import { AvailableTestpapersComponent } from "./available-testpapers/available-testpapers.component";
import { StartTestComponent } from "../test-papers/start-test/start-test.component";
import { CommonUtilsModule } from "../_common/common.module";
import { AdminModule } from "../admin/admin.module";
import { ViewTestpapersComponent } from "./view-test-paper/view-test-paper.component";
import { OderHistoryComponent } from './oder-history/oder-history.component';
import { OrderHistoryDetailsComponent } from './order-history-details/order-history-details.component';
import {MatDialogModule} from '@angular/material/dialog';
import { StudHomeComponent } from './stud-home/stud-home.component';
import { StudDashboardComponent } from './stud-dashboard/stud-dashboard.component';

import { ChartsModule } from "ng2-charts";
import { NgApexchartsModule } from "ng-apexcharts";
import { PieChartComponent } from './pie-chart/pie-chart.component';
import { BarChartComponent } from './bar-chart/bar-chart.component';
import { AreaChartComponent } from './area-chart/area-chart.component';


import { LineBarChartComponent } from './line-bar-chart/line-bar-chart.component';
import { FullCalendarModule } from 'ng-fullcalendar';


@NgModule({
  imports: [StudentsRoutingModule, CommonUtilsModule,  AdminModule,
    
    CommonModule, ReactiveFormsModule, FormsModule ,MatDialogModule,NgxPaginationModule,ChartsModule,NgApexchartsModule,
   FullCalendarModule],
  declarations: [
    StartTestComponent,
    ProfileComponent,
    StudentTroublesComponent, AvailableTestpapersComponent, ViewTestpapersComponent, OderHistoryComponent, OrderHistoryDetailsComponent, StudHomeComponent, StudDashboardComponent, PieChartComponent, BarChartComponent, AreaChartComponent, LineBarChartComponent],
  exports: [ProfileComponent],
  providers   : [ ]

})
export class StudentModule { }