import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  Input,
  ElementRef,
  ViewChild,
} from "@angular/core";
import { FormGroup } from "@angular/forms";
import { Subject } from "rxjs";
import { COUNTRIES } from "src/app/metaData/metaData";
import { CommonService } from "src/app/services/common.service";
import { EntityService } from "src/app/services/entity.service";
import { UtilsService } from "src/app/services/utlils.service";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: "app-add-teacher",
  templateUrl: "./add-teacher.component.html",
  styleUrls: ["./add-teacher.component.css"],
})
export class AddTeacherComponent implements OnInit {
  constructor(
    public authService: AuthService,
    public utilsService: UtilsService,
    public commonService: CommonService,
    public entityService: EntityService
  ) {}
  @ViewChild("profilePicInput") profilePicInputVariable: ElementRef;
  @Input() subjectList: any = {};
  @Input() form: FormGroup = null;
  @Input() formTrigger = new Subject();
  preview1: any = "";
  buttonText = "Add";
  today = this.commonService.getCurrentDateInDateInputFormat();
  loading = false;
  submitted = false;
  statesLoading = false;
  citiesLoading = false;
  cities: any[] = [];
  states: any[] = [];
  public countries: any = COUNTRIES.filter((country: any) =>
    country.pages.find((page: any) => page === "payment")
  );
  public get isSubjectsValid() {
    return (
      this.form && this.form.value && this.form.value.subjects.find((e) => e)
    );
  }
  public get isDataLoaded() {
    return this.cities.length && this.states.length;
  }
  public entities: any[] = [];
  public entity;
  @Output() teacherAdded = new EventEmitter();
  ngOnInit() {
    this.formTrigger.subscribe(async (data: any) => {
      const { value, action } = data;

      if (action === "INIT") {
        this.buttonText = "Add";
        this.submitted = false;
        this.preview1 = null;
        this.form.reset();
        this.form.controls["email"].enable();
        this.profilePicInputVariable.nativeElement.value = "";
      }
      if (action === "UPDATE") {
        this.form.controls["email"].disable();
        this.form.controls["mobileNo"].setValue(
          this.commonService.maskPhoneNumber(this.form.value.mobileNo)
        );
        this.states = [];
        this.cities = [];
        this.buttonText = "Update";
        this.submitted = false;
        this.preview1 = this.form.controls["avatar"].value;
        if (value) {
          const currentCountry = this.form.controls["country"].value;
          const currentState = this.form.controls["state"].value;
          this.statesLoading = true;
          await this.getStates(currentCountry);
          this.statesLoading = false;

          this.citiesLoading = true;
          const currentStateObj = this.states.find(
            (stateItem: any) => stateItem.name === currentState
          );
          await this.getCities(currentStateObj);
          this.citiesLoading = false;
        }
      }
    });
    this.getEntities();
  }

  getEntities(cb?: any) {
    this.entityService.getEntities().subscribe((response) => {
      this.entities = response.data;
      this.entity = this.entities[0].value;
      if (cb) {
        cb();
      }
    });
  }

  async onCountryChange(event) {
    const country = event.target.value;
    await this.getStates(country);
    this.form.controls["state"].patchValue("");
    this.form.controls["city"].patchValue("");
    this.form.controls["zip"].patchValue("");
  }

  async onStateChange(event) {
    const state = event.target.value;
    await this.getCities(
      this.states.find((stateItem: any) => stateItem.name === state)
    );
    this.form.controls["city"].patchValue("");
    this.form.controls["zip"].patchValue("");
  }

  /**
   * getStates
   */
  public getStates(country: string) {
    return new Promise((resolve) => {
      this.utilsService.getStates({ country }).subscribe((response) => {
        this.states = response.data.sort(
          this.commonService.GetSortOrder("name")
        );
        return resolve(true);
      });
    });
  }

  /**
   * getCities
   */
  public getCities(state: any) {
    return new Promise((resolve) => {
      this.utilsService
        .getCities({ state: state._id })
        .subscribe((response) => {
          this.cities = response.data.sort(
            this.commonService.GetSortOrder("name")
          );
          return resolve(true);
        });
    });
  }

  get f() {
    return this.form.controls;
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.form.invalid || !this.isSubjectsValid) {
      return;
    }

    this.loading = true;
    const subjects = this.form.value.subjects
      .map((subject: any, index: number) => {
        return subject ? this.subjectList[index]._id : false;
      })
      .filter((subject: any) => subject)
      .join(",");

    let { mobileNo } = this.form.value;
    mobileNo = mobileNo
      .replace("(", "")
      .replace(")", "")
      .replace("-", "")
      .replace(" ", "");

    const teacher = { ...this.form.value, subjects, mobileNo };

    this.teacherAdded.emit({ teacher });
    this.submitted = false;
  }

  async uploadFile(event: any) {
    const file = event.target.files[0] as File;
    const reader = new FileReader();
    reader.onload = () => {
      this.preview1 = reader.result as string;
    };
    reader.readAsDataURL(file);

    this.authService.upload("file", file).subscribe(
      (data) => {
        this.form.patchValue({ avatar: data.url });
      },
      (error) => {
        console.log("error in upload ");
        console.log(error);
      }
    );
  }

  public onEntityChange(event: any) {
    this.entity = event.target.value;
  }
}
