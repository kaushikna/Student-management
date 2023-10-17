import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { plans as PLANS} from '../../../../metaData/metaData';


@Component({
  selector: 'app-create-batch',
  templateUrl: './create-batch.component.html',
  styleUrls: ['./create-batch.component.css']
})
export class CreateBatchComponent implements OnInit {

  @Output() createBatchTrigger = new EventEmitter();
  @Input() form: any = null;
  @Input() entities: any[] = [];
  public plans: any = PLANS.filter((plan: any) => plan.pages.find((page: any) => page === 'addbatch'));
  public submitted = false;
  public today = null;
  constructor(private commonService: CommonService) { }

  ngOnInit() {
    this.today = this.commonService.getCurrentDateInDateInputFormat();

  }

  public get f() { return this.form.controls; }


  onClickCreateBatch() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }

    this.createBatchTrigger.emit({ batch: this.form.value });
    this.submitted = false;
  }

}
