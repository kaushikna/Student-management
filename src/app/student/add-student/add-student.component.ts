import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  Input,
  ViewChild,
  ElementRef,
} from "@angular/core";
import { FormGroup } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { Subject } from "rxjs";
import { CommonService } from "src/app/services/common.service";
import { UtilsService } from "src/app/services/utlils.service";
import { AddTeacherComponent } from "src/app/teacher/add-teacher/add-teacher.component";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: "app-add-student",
  templateUrl: "./add-student.component.html",
  styleUrls: ["./add-student.component.css"],
})
export class AddStudentComponent extends AddTeacherComponent implements OnInit {
  constructor(
    public authService: AuthService,
    public utilsService: UtilsService,
    public toastr: ToastrService,
    public commonService: CommonService
  ) {
    super(authService, utilsService, commonService, null);
  }
  @ViewChild("profilePicInput") profilePicInputVariable: ElementRef;
  @Input() grades: any = [];
  @Input() form: FormGroup = null;
  @Input() formTrigger = new Subject();
  @Output() studentAdded = new EventEmitter();
  today = this.commonService.getCurrentDateInDateInputFormat();
  entities: any[];

  ngOnInit() {
    this.formTrigger.subscribe(async (data: any) => {
      const { value, action } = data;
      if (action === "INIT") {
        this.form.reset();
        this.form.controls["email"].enable();
        this.buttonText = "Add";
        this.submitted = false;
        this.preview1 = null;
        this.profilePicInputVariable.nativeElement.value = "";
      }
      if (action === "UPDATE") {
        this.buttonText = "Update";
        this.form.controls["email"].disable();
        this.form.controls["mobileNo"].setValue(
          this.commonService.maskPhoneNumber(this.form.value.mobileNo)
        );
        if (this.form.value.parent.mobileNo) {
          const mobileNo = this.commonService.maskPhoneNumber(
            this.form.value.parent.mobileNo
          );
          this.form.value.parent.mobileNo = mobileNo;
          this.form.controls["parent"].setValue(this.form.value.parent);
        }
        this.submitted = false;
        this.preview1 = this.form.controls["avatar"].value;
        if (value) {
          const currentCountry = this.form.controls["country"].value;
          const currentState = this.form.controls["state"].value;
          this.statesLoading = true;
          this.citiesLoading = true;

          await this.getStates(currentCountry);
          const currentStateObj = this.states.find(
            (stateItem: any) => stateItem.name === currentState
          );
          await this.getCities(currentStateObj);
          this.citiesLoading = false;
          this.statesLoading = false;
        }
      }
    });
    this.getEntities();
  }

  onSaveStudent() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    this.loading = true;
    let {
      mobileNo,
      parent: { mobileNo: parentMobileNo = "" },
    } = this.form.value;
    mobileNo = mobileNo
      .replace("(", "")
      .replace(")", "")
      .replace("-", "")
      .replace(" ", "");
    const parent = this.form.value.parent || {};
    if (parentMobileNo) {
      parentMobileNo = parentMobileNo
        .replace("(", "")
        .replace(")", "")
        .replace("-", "")
        .replace(" ", "");
      parent.mobileNo = parentMobileNo;
    }

    this.studentAdded.emit({
      student: { ...this.form.value, mobileNo, parent },
    });
    this.submitted = false;
  }
}
