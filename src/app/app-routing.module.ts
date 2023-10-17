import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { LoginComponent } from "./login/login.component";
import { RegisterComponent } from "./register/register.component";
import { AuthGuard } from "./security/auth.guard";
import { Role } from "./Models/role";
import { VerifyComponent } from "./verify/verify.component";
import { ForgotPasswordComponent } from "./forgotpassword/forgotpassword.component";
import { StudentDashboardComponent } from "./student/student-dashboard/student-dashboard.component";

const routes: Routes = [
  { path: "", redirectTo: "/login", pathMatch: "full" },
  { path: "", component: LoginComponent },
  {
    path: "",
    component: StudentDashboardComponent,
    data: {
      title: "Admin Management"
    },
    children: [
      {
        path: "",
        pathMatch: "full",
        redirectTo: "admin"
      },
      {
        path: "admin",
        loadChildren: () =>
          import("./admin/admin.module").then(m => m.AdminModule),
        // canActivate: [AuthGuard],
        data: { roles: [Role.ADMIN] },
      },
      {
        path: "smart-student",
        loadChildren: () =>
          import("./student/student.module").then(m => m.StudentModule),
        canActivate: [AuthGuard],
        data: { roles: [Role.STUDENT] },
      },
      {
        path: "smart-tutor",
        loadChildren: () =>
          import("./tutor/tutor.module").then(m => m.TutorModule),
        canActivate: [AuthGuard],
        data: { roles: [Role.TUTOR] },
      }
    ]
  },
  {
    path: "login",
    component: LoginComponent,
  },
  {
    path: "forgot",
    component: ForgotPasswordComponent,
  },
  {
    path: "register",
    component: RegisterComponent,
  },
  {
    path: "verify",
    component: VerifyComponent,
  },
  { path: "**", redirectTo: "" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule],
})
export class AppRoutingModule { }
