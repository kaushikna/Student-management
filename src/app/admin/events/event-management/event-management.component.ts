import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { EventService } from '../../../services/event.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, Validators } from '@angular/forms';
import { SmartModal2Component } from 'src/app/utilities/smart-modal2/smart-modal2.component';
import { ModalConfig } from 'src/app/utilities/smart-modal2/modal.config';
import { CommonService } from 'src/app/services/common.service';
import { plans as PLANS } from '../../../metaData/metaData';
import { Subject } from 'rxjs';
import { PaginationInstance } from 'ngx-pagination';
import { AuthService } from 'src/app/services/auth.service';
import { TeacherService } from 'src/app/services/teacher.service';
import { StudentService } from 'src/app/services/student.service';
import { Role } from 'src/app/Models';
import { EntityService } from 'src/app/services/entity.service';

import { CalendarComponent } from 'ng-fullcalendar';
import { Options } from 'fullcalendar';
declare const $: any;


@Component({
  selector: 'app-event-management',
  templateUrl: './event-management.component.html',
  styleUrls: ['./event-management.component.css']
})
export class EventManagementComponent implements OnInit {
  mainarray: any
  @ViewChild('modalContent')
  @ViewChild('AddnnewEvents') AddnnewEvents: TemplateRef<any>;
  @ViewChild('viewevents') viewevents: TemplateRef<any>;
  calendarOptions: Options;
  @ViewChild(CalendarComponent) ucCalendar: CalendarComponent;

  displayEvent: any;
  batch: any = {};
  schedule: any = {};
  batches: any = [];
  public plans: any = PLANS.filter((plan: any) => plan.pages.find((page: any) => page === 'event'));
  students: any = [];
  subjects: any = [];
  schedules: any = [];
  teacherList: any = [];
  searchItems: any = [
    {
      title: "Student Id",
      value: "student_id",
      searchLength: 1,
    },
    {
      title: "Student Name",
      value: "student_name",
      searchLength: 4,
    },
    {
      title: "Batch Name",
      value: "batch_name",
      searchLength: 4,

    },
  ];
  public form: any = null;
  public scheduleForm: any = null;
  public scheduleFormHandle: Subject<any> = new Subject();
  public batchSearch: any = {
    filterCriteria: this.searchItems[0].value,
    searchString: ""
  };
  model: any = {
    data: [],
    data2: [],
  };
  public paginationConfig: PaginationInstance = {
    id: "paginationListId",
    itemsPerPage: 5,
    currentPage: 1,
    totalItems: this.model.data.length
  };
  public paginationConfig2: PaginationInstance = {
    id: "paginationListId2",
    itemsPerPage: 5,
    currentPage: 1,
    totalItems: this.model.data2.length
  };
  currentUser: any = {};
  entities: any[] = [];
Whendate:any
  finalarray = []

  ghj:any=[]

  constructor(
    private eventService: EventService,
    private studentService: StudentService,
    private formBuilder: FormBuilder,
    private teacherService: TeacherService,
    private authService: AuthService,
    private commonService: CommonService,
    private entityService: EntityService,
    private toastr: ToastrService,
    private Model:NgbModal,
  ) {
    this.currentUser = this.authService.getUser();

    const amount = "$1123000";
    const number = Number(amount.replace(/[^0-9.-]+/g, ""));
    const formattedNumber = number.toLocaleString("en-IN", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    });
    console.log(formattedNumber);
    
//     // Get the default second
//     var defaultSecond = 1685145599; // Replace 0 with your desired default second
    
//     // Compare the current second with the default second
//     if (currentTimeSeconds === defaultSecond) {
//       console.log("logout.");
//     } 
//      else {
//       console.log("login");
//     }
//     const array =['5665757544657']
//     const number = Number(array);
// this.ghj.push(number)
// console.log("this.ghj",this.ghj);


  
  }
  @ViewChild('toggleButton') toggleButton: ElementRef;
  @ViewChild('menu') menu: ElementRef;
  @ViewChild('modal1') private modal: SmartModal2Component;
  @ViewChild('modal2') private scheduleModal: SmartModal2Component;
  public createBatchConfig: ModalConfig = {
    modalTitle: "Create New Batch"
  };
  
  public scheduleModalConfig: ModalConfig = {
    modalTitle: "Schedule Class",
    size: 'lg'
  };

  openModalOne() {
    this.batch = {};
    this.createForm();
    this.modal.open();
  }
  createForm() {
    const plan = this.batch.plan || this.plans[1].id;

    this.form = this.formBuilder.group({
      _id: [this.batch._id],
      entityId: [this.batch.entityId],
      batchId: [this.batch.batchId],
      plan: [{ value: plan, disabled: true }],
      hours: [this.batch.hours, Validators.required],
      batchName: [this.batch.batchName, Validators.required],
      fromDate: [this.batch.fromDate, Validators.required],
      toDate: [this.batch.toDate, Validators.required],
    });
  }
  createScheduleForm() {

    this.scheduleForm = null;

    const subject = this.schedule.subject || this.subjects[0]._id;
    const teacher = this.schedule.teacher;
    const plan = this.schedule.plan;
    const batch = this.schedule.batch || this.model.data[0]._id;
    const fromTime = this.schedule.fromTime ? this.schedule.fromTime.hour + ":" + this.schedule.fromTime.minute : "";
    const toTime = this.schedule.toTime ? this.schedule.toTime.hour + ":" + this.schedule.toTime.minute : "";
    const scheduleDate = this.schedule.scheduleDate ? this.commonService.getDate(this.schedule.scheduleDate) : "";
    this.scheduleForm = this.formBuilder.group({
      _id: [this.schedule._id],
      batch: [batch],
      plan: [plan, Validators.required],
      scheduleDate: [scheduleDate, Validators.required],
      fromTime: [fromTime, Validators.required],
      meetingLink: [this.schedule.meetingLink],
      toTime: [toTime, Validators.required],
      teacher: [teacher, Validators.required],
      subject: [subject, Validators.required],
    });

    this.scheduleForm.get("scheduleDate").valueChanges.subscribe(
      () => {
        this.getAvailableTeachers();
      });
    this.scheduleForm.get("fromTime").valueChanges.subscribe(
      (value) => {
        this.scheduleForm.patchValue("fromTime", value);
        this.getAvailableTeachers();
      });
    this.scheduleForm.get("toTime").valueChanges.subscribe(
      (value) => {
        this.scheduleForm.patchValue("toTime", value);
        this.getAvailableTeachers();
      });
    this.scheduleForm.get("subject").valueChanges.subscribe(
      (value) => {
        this.scheduleForm.patchValue("subject", value);
        this.getAvailableTeachers();
      });
  }


  ngOnInit() {

    const query = {
      page: this.paginationConfig2.currentPage,
      pageSize: this.paginationConfig2.itemsPerPage
    };
    this.eventService.getSchedules(query).subscribe((response) => {
      this.mainarray = response.data

      this.mainarray.filter((data: any) => {

        const date = new Date(data.scheduleDate + "T00:00:00Z");
        const istDate = new Date(date.getTime() + (5.5 * 60 * 60 * 1000));
        const formattedDate = istDate;
        const eventcalnderdata = {
          title: data.batchDetails.student.firstName + " " + data.batchDetails.student.lastName,
          BatchName: data.batchDetails.batchName,
          TeacherName: data.teacherDetails.name,
          SubjectDetails: data.subjectDetails.name,
          start: formattedDate,
         
        }
        this.finalarray.push(eventcalnderdata)
      })
  
      this.calendarOptions = {
        editable: true,
        eventLimit: false,
        header: {
          left: 'prev,next today',
          center: 'title',
          right: 'month,agendaWeek,agendaDay,listMonth'
        },
        events: this.finalarray,
        selectable: true
      };
    });

    if (this.currentUser.role === Role.ADMIN) {
      this.getEventMeta();
      this.refreshData();
      this.getEntities();
    }

    this.refreshData2();
  }

  public getAvailableTeachers(): void {
    const { subject, fromTime, toTime, scheduleDate } = this.scheduleForm.value;

    if (subject && fromTime && toTime && scheduleDate) {
      const payload = {
        scheduleDate: this.scheduleForm.value.scheduleDate,
        subjectId: this.scheduleForm.value.subject,
        fromTime: this.scheduleForm.value.fromTime,
        toTime: this.scheduleForm.value.toTime,
      };
      this.teacherService.getAvailableTeachers({ ...payload, existingRecord: this.scheduleForm.value._id })
        .subscribe((response: any) => {
          this.teacherList = response;
          this.scheduleFormHandle.next({ action: "TEACHERS", value: this.teacherList });
        });
    }


  }


  public pageChange(event: any): void {
    this.paginationConfig.currentPage = event;
    this.loadData();
  }
  
  public pageChange2(event: any): void {
    this.paginationConfig2.currentPage = event;
    this.loadData2();
  }

  public refreshData(): void {
    this.paginationConfig.currentPage = 1;
    this.paginationConfig.itemsPerPage = 5;
    this.loadData();
  }

  public refreshData2(): void {
    this.paginationConfig2.currentPage = 1;
    this.paginationConfig2.itemsPerPage = 5;
    this.loadData2();
  }

  loadData() {

    const searchObj = { ...this.batchSearch };


    if (!searchObj.filterCriteria) {
      return;
    }

    const selectedSearchItem = this.searchItems.find((e: any) => {
      return e.value === searchObj.filterCriteria;
    });

    if (!searchObj.searchString || searchObj.searchString.length === 0) {
      searchObj.filterCriteria = "";
    }
    if (searchObj.searchString && searchObj.searchString.length > 0 && searchObj.searchString.length < selectedSearchItem.searchLength) {
      return;
    }

    const query = {
      page: this.paginationConfig.currentPage,
      pageSize: this.paginationConfig.itemsPerPage
    };
    this.eventService.getAllBatch(searchObj, query).subscribe(response => {
      this.model.data = response.data.map((dataItem: any, index: number) => {
        dataItem.student = dataItem.student ? dataItem.student.firstName + " " + dataItem.student.lastName : "";
        dataItem.planName = this.plans.find((planItem: any) => planItem.id === parseInt(dataItem.plan, 0)).value;
        dataItem.index = index + 1 + (this.paginationConfig.itemsPerPage * (this.paginationConfig.currentPage - 1));
        if (new Date(dataItem.toDate) > new Date()) {
          dataItem.addClass = true;
        }
        return dataItem;
      });
      this.paginationConfig.totalItems = response.total || response.data.length;
    });
  }

  loadData2() {
    const query = {
      page: this.paginationConfig2.currentPage,
      pageSize: this.paginationConfig2.itemsPerPage
    };
    this.eventService.getSchedules(query).subscribe(response => {
      this.model.data2 = response.data.map((dataItem: any, index: number) => {
        dataItem.planName = this.plans.find((planItem: any) => planItem.id === parseInt(dataItem.plan, 0)).value;


        const date = new Date();
        date.setHours(dataItem.fromTime.hour);
        date.setMinutes(dataItem.fromTime.minute);
        dataItem.fromTimeDisplay = date;


        const toDate = new Date();
        toDate.setHours(dataItem.toTime.hour);
        toDate.setMinutes(dataItem.toTime.minute);
        dataItem.toTimeDisplay = toDate;

        if (dataItem.plan === 1 && dataItem.batchDetails.student) {
          const student = dataItem.batchDetails.student;
          dataItem.batchDetails.batchName = student?.firstName + " " + student?.lastName;
        }



        dataItem.index = index + 1 + (this.paginationConfig.itemsPerPage * (this.paginationConfig.currentPage - 1));
        return dataItem;
      });
      this.paginationConfig2.totalItems = response.total || response.data.length;
    });
  }

  getEntities(cb?: any) {
    this.entityService.getEntities().subscribe(
      (response) => {
        this.entities = response.data;
        if (cb) {
          cb();
        }
      },
      (error) => {
        this.toastr.error(error.error.message, "find Failed", {
          timeOut: 3000,
        });
      }
    );
  }

  getEventMeta() {
    this.eventService.getEventMeta().subscribe(response => {
      this.subjects = response.subjects;
    });
  }

  createBatch(data: any) {
    if (data.batch.batchId) {
      this.eventService.updateBatch({ ...data.batch })
        .subscribe((response: any) => {
          this.toastr.success(response.message || 'Batch Updated Successfully', 'Batch', {
            timeOut: 3000
          });
          this.refreshData();
          this.modal.close();
        }, error => {
          this.modal.close();
          console.log("error in Create " + error.error.message);
          this.toastr.error(error.error.message, 'Update Batch', {
            timeOut: 3000
          });
        });

    } else {
      this.eventService.createBatch({ ...data.batch, plan: 2 })
        .subscribe((response: any) => {
          this.toastr.success(response.responseText, 'Batch', {
            timeOut: 3000
          });
          this.refreshData();
          this.modal.close();
        }, error => {
          console.log("error in Create " + error.error.message);
          this.toastr.error(error.error.message, 'Create Batch', {
            timeOut: 3000
          });
        });
    }

  }

  editBatch(data: any) {
    this.batch = data;
    this.createBatchConfig.modalTitle = "Edit Batch";
    this.createForm();
    this.modal.open();
  }


  public onClickDeleteBatch(item) {
    this.batch = item;
    $('#deleteModal').modal({
      show: true,
    });
  }

  public onDeleteConfirm(): void {
    this.deleteBatch(this.batch);
  }

  public onDeleteCancel() {
    $('#deleteModal').modal('toggle');
    this.batch = null;
  }

  public deleteBatch(data: any) {
    this.eventService.deleteBatch(data.batchId)
      .subscribe((response: any) => {
        this.toastr.success(response.message, 'Batch', {
          timeOut: 3000
        });
        this.refreshData();
        this.onDeleteCancel();
      }, error => {
        console.log("error in Create " + error.error.message);
        this.toastr.error(error.error.message, 'Create Batch', {
          timeOut: 3000
        });
      });
  }


  onScheduleClass(data: any) {

    if (data.schedule._id) {
      this.eventService.updateClass(data.schedule)
        .subscribe((response: any) => {
          this.toastr.success(response.responseText, 'Schedule Class', {
            timeOut: 3000
          });
          this.scheduleModal.close();
          this.refreshData();
          this.refreshData2();
        }, error => {
          this.scheduleModal.close();
          console.log("error in Schedule " + error.error.message);
          this.toastr.error(error.error.message, 'Schedule Class', {
            timeOut: 3000
          });
        });

    } else {
      this.eventService.scheduleClass(data.schedule)
        .subscribe((response: any) => {
          this.toastr.success(response.responseText, 'Schedule Class', {
            timeOut: 3000
          });
          this.scheduleModal.close();
          this.refreshData2();
        }, error => {
          this.scheduleModal.close();
          console.log("error in Schedule " + error.error.message);
          this.toastr.error(error.error.message, 'Schedule Class', {
            timeOut: 3000
          });
        });
    }



  }
  onClickCreateSchedule(batch: any) {
    this.schedule = { batch: batch._id, plan: batch.plan };
    this.batch = batch;
    this.createScheduleForm();
    this.scheduleFormHandle.next({ action: "INIT", value: false });
    this.scheduleModal.open();
  }

  editSchedule(data: any) {
    console.log("data",data);
    
    this.schedule = data;
    this.batch = data.batchDetails;
    this.batch.planName = data.planName;
    this.createScheduleForm();
    this.scheduleFormHandle.next({ action: "INIT", value: true });
    this.scheduleModal.open();
    this.getAvailableTeachers();
  }


  /**
   * onClickMeeting
   */
  public onClickMeeting(link: string) {
    window.open(link, "_blank");
  }


  /**
   * viewStudents
   */
  public viewStudents(batchId: any) {
    this.studentService.getStudentList({ batchId }).subscribe((response: any) => {
      this.students = response.map((element: any) => {
        element.fullName = element.firstName + " " + element.lastName;
        return element;
      });
      $('#viewStudentsModal').modal({
        show: true,
      });
    });
  }

  /**
   * onCancelViewStudents
   */
  public onCancelViewStudents() {
    $('#viewStudentsModal').modal('toggle');
    this.students = null;
  }


  dayRender ( cell) {
     
    let btn = document.createElement( "button" );
    btn.textContent = 'myButton';
    cell.append(btn);
  }




clickButton(model: any) {
  this.displayEvent = model;
}
eventClick(model: any) {
  console.log("model",model);
  
  console.log("this.model.data2t",this.model.data2);
  let arr : any
  arr = this.model.data2
  const selcectData =   arr.filter((data)=>{

    
    if(data.batchDetails.batchName === model.event.title){
      return data;
    }
    
  })
  

  this.schedule = selcectData[0];
  this.batch = selcectData[0].batchDetails;
  this.batch.planName = selcectData[0].planName;
  this.createScheduleForm();
  this.scheduleFormHandle.next({ action: "INIT", value: true });
  this.scheduleModal.open();
  this.getAvailableTeachers();
  console.log("modal",model);
  
  // model = {
  //   event: {
  //     id: model.event.id,
  //     start: model.event.start,
  //     title: model.event.title ,
  //     BatchName:model.event.BatchName,
  //     SubjectDetails:model.event.SubjectDetails
  //   },
   
  // }
  // this.scheduleFormHandle.next({ action: "INIT", value: true });

  // this.displayEvent = model;
}
updateEvent(model: any) {
  model = {
    event: {
      id: model.event.id,
      start: model.event.start,
      title: model.event.title,
      BatchName:model.event.BatchName,
      SubjectDetails:model.event.SubjectDetails
      // other params
    },
  
  }
  this.displayEvent = model;
}

dayClick(event) {
  console.log("event.day",);
  var date = new Date(event.date._d),
    mnth = ("0" + (date.getMonth() + 1)).slice(-2),
    day = ("0" + date.getDate()).slice(-2);
    this.Whendate = [date.getFullYear(), mnth, day].join("-");

  this.Model.open(this.AddnnewEvents, { size: 'lg' });

}

addNewevnts() {
  this.Model.open(this.AddnnewEvents, { size: 'lg' });
}

isChecked: boolean = false;

  // Function to check the checkbox value
  checkboxValues: any[] = [
    { name: 'Value 1', checked: false },
    { name: 'Value 2', checked: false },
    { name: 'Value 3', checked: false }
  ];

  updateValues() {
    this.checkboxValues = this.checkboxValues.filter(value => value.checked);
    console.log("hiiiii", this.checkboxValues);
    
  }

}
