import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-schedule-classes',
  templateUrl: './schedule-classes.component.html',
  styleUrls: ['./schedule-classes.component.css']
})
export class ScheduleClassesComponent implements OnInit {

  alert = { type: '', message: '' };

  @Input() subjects: any[];
  @Input() batch: any;
  @Input() teacherList: any[];
  @Input() form: FormGroup;
  @Input() formTrigger = new Subject();

  @Output() scheduleTriggered = new EventEmitter();

  dateError = false;
  timeError = false;
  timeErrorMessage;
  dateErrorMessage;
  timeErrorMessages = ["To Time is less than From Time", "Only x Hours available"];
  submitted = false;
  loading = false;
  edit = false;
  getDateFormat(date?: any) {
    return this.commonService.getCurrentDateInDateInputFormat(date);
  }

  getMinDate() {
    const minDate = this.getDateFormat(this.batch.fromDate);
    return minDate;
  }
  getMaxDate() {
    if(this.batch.toDate) {
        return this.getDateFormat(this.batch.toDate);
    }
    else{
    // we do not have batch date when editing an alredy scheduled class.
    // For the time being, adding date range as current date + 2 weeks to reschedule a class
        const maxDate = new Date();
        maxDate.setDate(maxDate.getDate() + 14);
        return this.getDateFormat(maxDate);
    }
  }
  get f() { return this.form.controls; }


  constructor(private commonService: CommonService) {
  }

  ngOnInit() {
    this.formTrigger.subscribe((data: any) => {
      const { value, action } = data;
      if (action === "INIT") {
        this.edit = value;
        this.timeError = false;
        this.submitted = false;
        this.teacherList = [];
      }
      if (action === "TEACHERS") {
        this.teacherList = value;
        if (this.teacherList.length) {
          if (!this.form.controls.teacher.value) {
            this.form.controls.teacher.setValue(this.teacherList[0]._id);
          }
        }
      }
    });
  }




  onSubmit() {
    this.submitted = true;
    this.timeError = false;
    this.dateError = false;

    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }


    if (new Date(this.batch.fromDate) > new Date(this.form.value.scheduleDate)) {
      this.dateErrorMessage = "Schedule date should  be greater than batch start date";
      this.dateError = true;
      return;
    }



    const { fromTime, toTime } = this.form.value;
    const fromTimeFormatted = fromTime.split(":");
    const toTimeFormatted = toTime.split(":");
    if (Date.parse('01/01/2011 ' + toTime) <= Date.parse('01/01/2011 ' + fromTime)) {
      this.timeErrorMessage = this.timeErrorMessages[0];
      this.timeError = true;
      return;
    }

    const fromTimeDateFormat: any = new Date("01/01/2007 " + fromTime);
    const toTimeDateFormat: any = new Date("01/01/2007 " + toTime);
    console.log("fromTimeDateFormat",fromTimeDateFormat , "toTimeDateFormat",toTimeDateFormat);
    
    const hourDiff: any = (toTimeDateFormat - fromTimeDateFormat) / (1000 * 3600);
    const hoursAvailable = this.batch.hours - this.batch.filledHours;
    if (this.batch.plan === 1 && hourDiff > hoursAvailable) {
      this.timeErrorMessage = this.timeErrorMessages[1].replace("x", hoursAvailable.toString());
      this.timeError = true;
      return;
    }

    this.loading = true;
    const schedule = this.form.value;
    const fromTimeObj = { fromTime: { hour: fromTimeFormatted[0], minute: fromTimeFormatted[1] } };
    const toTimeObj = { toTime: { hour: toTimeFormatted[0], minute: toTimeFormatted[1] } };
    this.scheduleTriggered.emit({ schedule: { ...schedule, ...fromTimeObj, ...toTimeObj } });
  }

  
}


