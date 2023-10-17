import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { StudentService } from '../../services/student.service';
import { SmartModalComponent } from '../../utilities/smart-modal/smart-modal.component';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { grades } from '../../metaData/metaData';
import { CommonService } from 'src/app/services/common.service';
import { PaginationInstance } from 'ngx-pagination';
import { Subject } from 'rxjs';
declare const $: any;


@Component({
  selector: 'app-student-management',
  templateUrl: './student-management.component.html',
  styleUrls: ['./student-management.component.css']
})

export class StudentManagementComponent implements OnInit {
  @ViewChild('toggleButton') toggleButton: ElementRef;
  @ViewChild('menu') menu: ElementRef;

  public searchString = '';
  public batches: any[];
  public grades: any[] = grades;
  selectedItem: any = {};
  student: any = {};
  form: FormGroup = null;
  modalTitle = '';
  model: any = {
    data: []
  };
  public formHandle: Subject<any> = new Subject();
  public paginationConfig: PaginationInstance = {
    id: "paginationListId",
    itemsPerPage: 5,
    currentPage: 1,
    totalItems: this.model.data.length
  };


  constructor(
    private studentService: StudentService,
    private formBuilder: FormBuilder,
    private commonService: CommonService,
    private toastr: ToastrService) {
      
     }

  @ViewChild(SmartModalComponent, { static: true })

  private modal: SmartModalComponent;


  onclickAdd() {
    this.modalTitle = 'Add Student';
    this.createForm();
    this.student = {};
    this.modal.open("xl");
    setTimeout(() => {
      this.formHandle.next({ action: "INIT", value: true });
    });
  }
  onclickUpdate(st: any) {
    this.modalTitle = 'Update Student';
    this.student = st;
    this.createForm();
    this.modal.open("xl");
    setTimeout(() => {
      this.formHandle.next({ action: "UPDATE", value: true });
    });
  }

  ngOnInit() {
    this.refreshData();
    }
    
  public pageChange(event: any): void {
    this.paginationConfig.currentPage = event;
    this.loadData();
  }

  public refreshData(): void {
    this.paginationConfig.currentPage = 1;
    this.paginationConfig.itemsPerPage = 5;
    this.loadData();
  }

  public onEntityClick(item: any): void {
    this.selectedItem = item;
    $('#student-details').modal({
      show: true,
    });
  }

  public closeModal(): void {
    $('#student-details').modal('toggle');
    this.selectedItem = null;
  }

  loadBatches() {
    this.studentService.getBatches().subscribe(response => {
      this.batches = response;
    });
  }

  createForm() {
    this.form = this.formBuilder.group({
      _id: [this.student._id],
      grade: [this.student.grade, Validators.required],
      firstName: [this.student.firstName, [Validators.required, Validators.minLength(3)]],
      lastName: [this.student.lastName, [Validators.required, Validators.minLength(3)]],
      email: [this.student.email, [Validators.required, Validators.email]],
      avatar: [this.student.avatar],
      mobileNo: [this.student.mobileNo, [Validators.required, Validators.minLength(14)]],
      dateOfBirth: [this.commonService.getDate(this.student.dateOfBirth), Validators.required],
      gender: [this.student.gender, Validators.required],
      address: [this.student.address, Validators.required],
      city: [this.student.city, Validators.required],
      zip: [this.student.zip, Validators.required],
      state: [this.student.state, Validators.required],
      country: [this.student.country, Validators.required],
      parent: this.formBuilder.group({ // make a nested group
        firstName: [this.student.parent ? this.student.parent.firstName : ""],
        lastName: [this.student.parent ? this.student.parent.lastName : ""],
        email: [this.student.parent ? this.student.parent.email : "", Validators.email],
        mobileNo: [this.student.parent ? this.student.parent.mobileNo : "", [Validators.minLength(14)]],
      }),
    });
  }

  loadData() {
    const query = {
      page: this.paginationConfig.currentPage,
      pageSize: this.paginationConfig.itemsPerPage,
      searchString: this.searchString
    };
    this.studentService.getAllStudents(query).subscribe(response => {
      this.model.data = response.data.map((dataItem: any, index: number) => {
        dataItem.avatar = dataItem.avatar || "/assets/images/profile.svg";
        dataItem.index = index + 1 + (this.paginationConfig.itemsPerPage * (this.paginationConfig.currentPage - 1));
        return dataItem;
      });
      this.paginationConfig.totalItems = response.total || response.data.length;
    });
  }

  addStudent(data) {
    if (!data.student._id) {
      this.studentService.addStudent(data.student)
        .subscribe((response: any) => {
          this.refreshData();
          this.toastr.success(response.responseText, 'Student', {
            timeOut: 3000
          });
          this.modal.close();
        }, error => {
          this.modal.close();
          console.log("error in Add " + error.error.message);
          this.toastr.error(error.error.message, 'Save Failed', {
            timeOut: 3000
          });
        });
    } else {
      this.studentService.updateStudent(data.student)
        .subscribe((response: any) => {
          this.refreshData();
          this.toastr.success(response.responseText, 'Student', {
            timeOut: 3000
          });
          this.modal.close();

        }, error => {
          this.modal.close();
          console.log("error in update " + error.error.message);
          this.toastr.error(error.error.message, 'Update Failed', {
            timeOut: 3000
          });
        });
    }
  }

  public deleteStudent(st) {
    this.selectedItem = st;
    $('#deleteModal').modal({
      show: true,
    });
  }

  public onDeleteConfirm(): void {
    this.studentService.deleteStudent(this.selectedItem.studentId)
      .subscribe(response => {
        this.refreshData();
        this.toastr.success(response.message, 'Student', {
          timeOut: 3000
        });
        this.onDeleteCancel();
      });

  }
  public onDeleteCancel() {
    $('#deleteModal').modal('toggle');
    this.selectedItem = null;
  }

}
