import { BrowserModule } from "@angular/platform-browser";
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { NgbModule, NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ToastrModule } from "ngx-toastr";
import { FileSelectDirective } from "ng2-file-upload";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { AuthInterceptor } from "./security/auth.interceptor";
import { HeaderComponent } from "./header/header.component";
import { FooterComponent } from "./footer/footer.component";
import { LoginComponent } from "./login/login.component";
import { AlertnotificationComponent } from "./utilities/alertnotification/alertnotification.component";
import { RegisterComponent } from "./register/register.component";
import { NgxPaginationModule } from "ngx-pagination";
import { RecaptchaFormsModule, RecaptchaModule, RecaptchaSettings, RECAPTCHA_SETTINGS } from 'ng-recaptcha';
import { CommonModule } from '@angular/common';
import { VerifyComponent } from "./verify/verify.component";
import { ForgotPasswordComponent } from "./forgotpassword/forgotpassword.component";
import { ResourceLibraryComponent } from "./student/resource-library/resource-library.component";
import { StudentDashboardComponent } from "./student/student-dashboard/student-dashboard.component";
import { LayoutComponent } from "./dashboard/dashboard-left-nav/dashboard-left-nav.component";
import { CommonUtilsModule } from "./_common/common.module";
import { ViewResourceComponent } from "./student/view-resource/view-resource.component";
import { ViewChapterComponent } from "./student/view-chapter/view-chapter.component";
import { YouTubePlayerModule } from '@angular/youtube-player';
import { QuizListComponent } from "./student/quiz-list/quiz-list.component";
import { AngularEditorModule } from '@kolkov/angular-editor';
import { PaymentmethodComponent } from './paymentmethod/paymentmethod.component';
import { ChartsModule } from 'ng2-charts';
import { NgApexchartsModule } from "ng-apexcharts";
import { FullCalendarModule } from 'ng-fullcalendar';



@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    LoginComponent,
    AlertnotificationComponent,
    RegisterComponent,
    FileSelectDirective,
    VerifyComponent,
    ForgotPasswordComponent,
    ResourceLibraryComponent,
    ViewResourceComponent,
    QuizListComponent,
    ViewChapterComponent,
    StudentDashboardComponent,
    LayoutComponent,
    PaymentmethodComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    CommonUtilsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    NgbModule,
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot({
      timeOut: 5000
    }), // ToastrModule added
    NgxPaginationModule,
    RecaptchaModule,
    RecaptchaFormsModule,
    YouTubePlayerModule,
    AngularEditorModule,
    ChartsModule,
    NgApexchartsModule,
    FullCalendarModule
  ],
  
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    {
      provide: RECAPTCHA_SETTINGS,
      useValue: { siteKey: '6LcDvAQcAAAAAOjRgaoDpyXiP9ZyvAAWO5vzr0r0' } as RecaptchaSettings,
    },
    NgbActiveModal,
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
