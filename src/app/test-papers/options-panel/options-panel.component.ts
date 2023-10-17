import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, ControlContainer, FormGroupDirective } from "@angular/forms";
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-options-panel',
  templateUrl: './options-panel.component.html',
  styleUrls: ['./options-panel.component.css'],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]
})
export class OptionsPanelComponent implements OnInit {

  constructor(public fb: FormBuilder, private parentF: FormGroupDirective, private authService: AuthService) { }
  @Input() optionNo: number;
  @Input() questionNo: number;
  @Input() optionFormGroup: any = FormGroup;
  @Input() controlPath: any;
  @Input() controlValue: any;



  oForm: FormGroup | any;
  childForm;
  fd = new FormData();
  file: File = null;
  preview: any = '';
  control: FormControl;

  optionUploadType: any = [
    {
      id: 1,
      value: "Text"
    },
    {
      id: 2,
      value: "Image"
    }
  ];


  ngOnInit() {
    // const optionFormArray = this.parentF.form.get(
    //   'options'
    // ) as FormArray;
    this.childForm = this.parentF.form;
    // this.oForm = optionFormArray.controls[this.optionNo] as FormGroup;

  }

  changeSuit(e) {
    this.oForm.selectedOption = e.target.value;
  }
  async uploadFile(event) {
    this.fd = new FormData();
    this.file = event.target.files[0] as File;
    this.fd.append('avatar', this.file);
    const reader = new FileReader();
    reader.onload = () => {
      this.preview = reader.result as string;
    };
    reader.readAsDataURL(this.file);

    this.authService.upload('file', this.file).subscribe(() => {
    }, error => {
      console.log("error in upload " + error);
    });
  }
}
