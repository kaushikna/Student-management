import { Component, OnInit, Input } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  FormArray,
  ControlContainer,
  FormGroupDirective,
} from "@angular/forms";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: "app-question-panel",
  templateUrl: "./question-panel.component.html",
  styleUrls: ["./question-panel.component.css"],
  viewProviders: [
    { provide: ControlContainer, useExisting: FormGroupDirective },
  ],
})
export class QuestionPanelComponent implements OnInit {
  qForm: FormGroup;
  childForm;
  selecquestionOption = 0;
  entryTextValue = "";
  optionPreview = {};
  qtype = 0;

  optionsArray: any = [];
  @Input() questionNo: number;
  @Input() question: any = {};
  @Input() testPapersFormGroup: any = FormGroup;
  @Input() controlPath: any;
  @Input() controlValue: any;

  control: FormControl;
  optionFormArray: FormArray;
  fd = new FormData();
  file: File = null;
  preview: any = "";
  optionUploadType: any = [
    {
      id: 0,
      value: "Text",
    },
    {
      id: 1,
      value: "Image",
    },
  ];

  constructor(
    public fb: FormBuilder,
    private parentF: FormGroupDirective,
    private authService: AuthService
  ) { }

  prepareOptionsArray(limit) {
    for (let i = 1; i <= limit; i++) {
      this.optionsArray.push(i);
    }
  }
  changeQuestionType(qValue, question) {
    switch (qValue) {
      case "Simple":
        question.questionTypeId.setValue(0);
        break;
      case "Passage":
        question.questionTypeId.setValue(1);
        break;
    }
  }

  questionOption(val) {
    this.selecquestionOption = parseInt(val, 0);

  }

  changeText(event, option) {
    // console.log(event, option);
    option.entryText.setValue(event.target.value);
  }
  questionImageType(val) {
    this.qtype = parseInt(val, 0);
  }

  async uploadFile(event) {
    this.fd = new FormData();
    this.file = event.target.files[0] as File;
    this.fd.append("avatar", this.file);
    const reader = new FileReader();
    reader.readAsDataURL(this.file);
    reader.onload = () => {
      this.preview = reader.result as string;
    };
    this.authService.upload('file', this.file).subscribe(
      (data) => {
        //  console.log(data, this.qForm["image"]);
        // tslint:disable-next-line:no-string-literal
        this.qForm['image'].setValue(data.imageName);
        // //option.optionAvatar.setValue(data.imageName);
        // console.log(event, option, data);
        // //option.entryImage.patchValue(data.imageName);
        // console.log(data.imageName);
      },
      (error) => {
        console.log("error in upload " + error);
      }
    );
  }

  async uploadFileOption(event, option) {
    this.fd = new FormData();
    this.file = event.target.files[0] as File;
    this.fd.append("avatar", this.file);
    const reader = new FileReader();
    reader.readAsDataURL(this.file);
    reader.onload = () => {
      this.optionPreview[option] = reader.result as string;
    };
    await this.authService.upload('file', this.file).subscribe(
      (data) => {
        // console.log(this.qForm["options"]);
        // tslint:disable-next-line:no-string-literal
        const valdata = this.qForm["options"].value;
        valdata[option].entryImage = data.url;
        // tslint:disable-next-line:no-string-literal
        this.qForm["options"].setValue(valdata);
        // this.qForm["options"]["value"][option]["entryImage"] = data.imageName;
        // console.log(this.qForm["options"]["value"], data.imageName);
      },
      (error) => {
        console.log("error in upload " + error);
      }
    );
  }
  ngOnInit() {


    if (!this.parentF.form) {
      return;
    }

    this.optionFormArray = this.parentF.form.controls.options as FormArray;
    this.childForm = this.parentF.form;
    this.qForm = this.childForm.controls;
    // console.log(this.qForm, this.optionFormArray);
    // tslint:disable-next-line:no-string-literal
    this.qtype = this.qForm["questionTypeId"].value;
    // tslint:disable-next-line:no-string-literal
    this.preview = this.qForm["image"].value;
    // tslint:disable-next-line:no-string-literal
    if (this.qForm["optionsType"].value === 0) {
      this.entryTextValue = this.optionFormArray.value[0].selectedOption;
    } else {
      this.selecquestionOption = 1;
    }
    for (const option in this.optionFormArray.value) {
      if (this.optionFormArray.value.hasOwnProperty(option)) {
        this.optionPreview[option] =
          this.optionFormArray.value[option].entryImage;
      }
    }
    // tslint:disable-next-line:no-string-literal
    if (this.qForm["questionNum"].value && this.qForm["questionNum"].value !== 0) {
      // tslint:disable-next-line:no-string-literal
      this.questionNo = this.qForm["questionNum"].value;
    } else {
      // tslint:disable-next-line:no-string-literal
      this.qForm["questionNum"].value = this.questionNo;
    }
  }
}
