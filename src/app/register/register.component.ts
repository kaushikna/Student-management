import { Component, OnInit } from '@angular/core';
import { roles, grades, COUNTRIES } from '../metaData/metaData';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { ToastrService } from 'ngx-toastr';
import { Role } from '../Models';
import { TestPaperService } from '../services/test-paper.service';
import { CommonService } from '../services/common.service';
import { UtilsService } from '../services/utlils.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  grades: any = grades;
  roles: any = roles.filter((role: any) => role.pages.find((page: any) => page === 'register'));
  public countries: any = COUNTRIES.filter((country: any) => country.pages.find((page: any) => page === 'register'));
  subjects: any = [];
  Role: any = Role;
  preview1: any = '';
  form: FormGroup;
  today = null;
  states = [];
  cities = [];

  constructor(
    private authService: AuthService,
    private utilsService: UtilsService,
    private testPaperService: TestPaperService,
    private commonService: CommonService,
    private router: Router, private toastr: ToastrService, public fb: FormBuilder) {
    this.initForm(roles[1].value);
    this.today = this.commonService.getCurrentDateInDateInputFormat();
  }

  ngOnInit() {
    this.testPaperService.getAllSubjectsPublic().subscribe((response: any) => {
      this.subjects = response.data;
    });
  }

  initForm(role: string) {
    this.form = this.fb.group({
      role: [{ value: role, disabled: false }, Validators.required],
      grade: [''],
      firstName: ['', [Validators.required, Validators.minLength(3)]],
      lastName: ['', [Validators.required, Validators.minLength(3)]],
      mobileNo: ['', [Validators.required, Validators.minLength(14)]],
      email: ['', [Validators.required, Validators.email]],
      avatar: [''],
      dateOfBirth: ['', Validators.required],
      subjects: this.getSubjectsArray(this.subjects),
      parentFirstName: ['', [Validators.minLength(3)]],
      parentLastName: ['', [Validators.minLength(3)]],
      parentEmail: ['', [Validators.email]],
      parentPhone: ['', [Validators.minLength(14), Validators.maxLength(14)]],
      qualification: [''],
      gender: ['', Validators.required],
      availableFrom: [''],
      summary: [''],
      address: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      country: ['', Validators.required],
      zip: ['', Validators.required],
      recaptchaReactive: [null]
    });
  }

  get registerFormControl() {
    return this.form.controls;
  }

  onRoleChange() {
    this.initForm(this.form.value.role);
  }

  onCountryChange(event) {
    const country = event.target.value;
    this.getStates(country);
  }

  onStateChange(event) {
    const state = event.target.value;
    this.getCities(this.states.find((stateItem: any) => stateItem.name === state));
  }

  /**
   * getStates
   */
  public getStates(country: string) {
    this.utilsService.getStates({ country }).subscribe((response) => {
      this.states = response.data.sort(this.commonService.GetSortOrder("name"));
    });
  }

  /**
   * getCities
   */
  public getCities(state: any) {
    this.utilsService.getCities({ state: state._id }).subscribe((response) => {
      this.cities = response.data.sort(this.commonService.GetSortOrder("name"));

    });
  }

  getSubjectsArray(subjectsList: any[]) {
    const arr = subjectsList.map(() => new FormControl(false));
    return new FormArray(arr);
  }

  async uploadFile(event: any) {
    const file = event.target.files[0] as File;
    const reader = new FileReader();
    reader.onload = () => {
      this.preview1 = reader.result as string;
    };
    reader.readAsDataURL(file);

    this.authService.upload('file', file)
      .subscribe(data => {
        this.form.patchValue({
          avatar: data.url
        });
      }, error => {
        console.log("error in upload ");
        console.log(error);
      });
  }

  async onRegister() {
    const { email, role, grade, firstName, lastName, mobileNo, dateOfBirth, parentMobileNo = "" } = this.form.value;
    const subjects = this.form.value.subjects.map((subject: any, index: number) => {
      return subject ? this.subjects[index]._id : false;
    }).filter((subject: any) => subject).join(',');

    const user = {
      email, userName: email, role, grade, firstName, lastName,
      mobileNo: mobileNo.replace("(", "").replace(")", "").replace("-", "").replace(" ", ""),
      dateOfBirth,
      subjects,
      avatar: this.form.value.avatar,
      parent: {
        firstName: this.form.value.parentFirstName,
        lastName: this.form.value.parentLastName,
        email: this.form.value.parentEmail,
        mobileNo: parentMobileNo.replace("(", "").replace(")", "").replace("-", "").replace(" ", ""),
      },
      qualification: this.form.value.qualification,
      gender: this.form.value.gender,
      availableFrom: this.form.value.availableFrom,
      summary: this.form.value.summary,
      address: this.form.value.address,
      city: this.form.value.city,
      state: this.form.value.state,
      country: this.form.value.country,
      zip: this.form.value.zip
    };

    this.authService.register(user, this.form.value.recaptchaReactive)
      .subscribe(data => {
        this.toastr.success(data.responseText, 'Sign Up', {
          timeOut: 3000
        });
        this.router.navigate(['/login']);
      }, error => {
        grecaptcha.reset();
        this.toastr.error(error || "Restration Failed", 'Sign Up', {
          timeOut: 3000
        });
      });
  }

  captchaResolved(captchaResponse: string) {
    console.log(`Resolved response token: ${captchaResponse}`);
  }
}
