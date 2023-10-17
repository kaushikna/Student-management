import { Component,OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { grades } from 'src/app/metaData/metaData';
import { Role } from 'src/app/Models';
import { CommonService } from 'src/app/services/common.service';
import { UserService } from '../../services/user.service';

declare const $: any;

@Component({
  selector: 'app-student-profile',
  templateUrl: './student-profile.component.html',
  styleUrls: ['./student-profile.component.css',
],
})
export class ProfileComponent implements OnInit {
  public user: any = {};
  form: FormGroup = null;
  public grades: any[] = grades;
  loading = false;
  submitted = false;
  get f() { return this.form.controls; }


  constructor(private userService: UserService, 
    private formBuilder: FormBuilder, 
    private commonService: CommonService,
 ) { }

  ngOnInit() {
    this.getUserProfile();
  }

  public getUserProfile(): void {
    this.userService.getProfile().subscribe((response: any) => {
      console.log("response",response);
      
      
      if (response) {
        this.user = response;
        this.createForm();
      }
    });
  }

  

  public onEditProfile(): void {
    $('#editProfile').modal({
      show: true
    });
  }
  public  canvasphone() : void {
    $('#phonestudent').modal({
      show: true
    });
  }
  public Editstudentname() :void {
    $('#Studentname').modal({
      show: true
    });
  }
  public Editstudentaddress() :void {
    $('#Studentaddress').modal({
      show: true
    });
  }
public parentdetials() :void {
  $('#parentdetials').modal({
    show: true
  });
}
public resetpassword() :void {
  $('#resetpassword').modal({
    show: true
  });
}
public Multifactor() :void {
  $('#Multifactor').modal({
    show: true
  });
}

public parentphone() :void {
  $('#phoneparent').modal({
    show: true
  });
}  

public Studentsemail() :void {
  $('#emailstudent').modal({
    show: true
  });
}

  public createForm(): void {


    if (this.user.role === 'student') {
      this.form = this.formBuilder.group({
        _id: [this.user._id],
        grade: [this.user.grade, Validators.required],
        firstName: [this.user.firstName, [Validators.required, Validators.minLength(3)]],
        lastName: [this.user.lastName, [Validators.required, Validators.minLength(3)]],
        Address:[this.user.address,Validators.required],
        Email:[this.user.email,Validators.required],
        mobileNo: [this.commonService.maskPhoneNumber(this.user.mobileNo), [Validators.required, Validators.minLength(14)]],
        dateOfBirth: [this.commonService.getDate(this.user.dateOfBirth), Validators.required],
        parent: this.formBuilder.group({ // make a nested group
          firstName: [this.user.parent ? this.user.parent.firstName : ""],
          lastName: [this.user.parent ? this.user.parent.lastName : ""],
          email: [this.user.parent ? this.user.parent.email : "", Validators.email],
          mobileNo: [this.user.parent ? this.commonService.maskPhoneNumber(this.user.parent.mobileNo) : "", [Validators.minLength(14)]],
        }),
      });
    } else if (this.user.role === "tutor") {
      this.form = this.formBuilder.group({
        _id: [this.user._id],
        firstName: [this.user.firstName, [Validators.required, Validators.minLength(3)]],
        lastName: [this.user.lastName, [Validators.required, Validators.minLength(3)]],
        mobileNo: [this.commonService.maskPhoneNumber(this.user.mobileNo), [Validators.required, Validators.minLength(14)]],
        dateOfBirth: [this.commonService.getDate(this.user.dateOfBirth), Validators.required],
      });
    }



  }

  public onSaveUser(): void {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    this.loading = true;


    const payload = { ...this.form.value };
    let { mobileNo, parent: { mobileNo: parentMobileNo = "" } = {} } = this.form.value;
    mobileNo = mobileNo.replace("(", "").replace(")", "").replace("-", "").replace(" ", "");
    parentMobileNo = parentMobileNo.replace("(", "").replace(")", "").replace("-", "").replace(" ", "");


    Object.assign(payload, { mobileNo });


    if (this.user.role === Role.STUDENT) {
      const parent = this.form.value.parent || {};
      parent.mobileNo = parentMobileNo;
      Object.assign(payload, { parent });
    }

    this.userService.updateProfile(payload).subscribe(() => {
      this.getUserProfile();
      $('#editProfile').modal('toggle');
    });
  }


}
