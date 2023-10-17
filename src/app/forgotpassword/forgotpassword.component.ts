import { Component, ViewChild } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.css']
})
export class ForgotPasswordComponent {

  loading = false;
  submitted = false;
  @ViewChild('f', { static: true }) formValues;
  form: FormGroup;
  constructor(private authService: AuthService, public fb: FormBuilder, private toastr: ToastrService, private router: Router) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  get f() {
    return this.form.controls;
  }
  onLogin() {
    this.authService.forgotPassword(this.form.value).subscribe(() => {
      this.toastr.success("New Password has been sent to your email", 'Reset Password', {
        timeOut: 3000
      });
      this.router.navigate(['/login']);
    }, error => {
      console.log("error in Login " + error.error.message);
      this.toastr.error(error.error.message, 'Login Failed', {
        timeOut: 3000
      });
    });
  }

}
