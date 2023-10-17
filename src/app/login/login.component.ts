import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { roles } from '../metaData/metaData';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Role } from '../Models';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loading = false;
  submitted = false;
  returnUrl: string;
  @ViewChild('f', { static: true }) formValues;
  form: FormGroup;
  roles: any = roles.filter((role: any) => role.pages.find((page: any) => page === 'login'));
  constructor(private authService: AuthService, public fb: FormBuilder, private route: ActivatedRoute, private router: Router,
              public toastr: ToastrService) {
    if (!this.authService.isLoggedIn) {
      this.router.navigate(['/']);
    }
    this.form = this.fb.group({
      role: ['', [Validators.required]],
      userName: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  get f() {
    return this.form.controls;
  }

  ngOnInit() {
    localStorage.removeItem('access_token');
    this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/';
  }

  async onLogin() {
    this.authService.login(this.form.value).subscribe((data: any) => {
      localStorage.setItem('access_token', data.accessToken);
      const { avatar, email, role, userName, studentAccountType } = data;
      localStorage.setItem('currentUser', JSON.stringify({ avatar, email, role, studentAccountType, userName }));
      this.loadDashBoard(data.role);
    }, (error) => {
      this.toastr.error(error.error.message, 'Login Failed', {
        timeOut: 3000
      });
    });
  }

  loadDashBoard(role) {
    switch (role) {
      case Role.ADMIN:
        this.router.navigate(['/admin']);
        break;
      case Role.STUDENT:
        this.router.navigate(['/smart-student']);
        break;
      case Role.TUTOR:
        this.router.navigate(['/smart-tutor']);
        break;
      default:
        this.router.navigate(['/']);
        break;
    }
  }

  onSignup() {
    this.router.navigate(['/register']);
  }

}
