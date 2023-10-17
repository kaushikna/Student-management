
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaginationInstance } from 'ngx-pagination';
import { ToastrService } from 'ngx-toastr';
import { StudentService } from 'src/app/services/student.service';
import { TROUBLE_PRIORITIES, TROUBLE_REQUEST_STATUSES, TROUBLE_REQUEST_TYPES } from '../../metaData/metaData';
import { TroubleService } from '../../services/trouble.service';
declare const $: any;

@Component({
  selector: 'app-troubles',
  templateUrl: './troubles.component.html',
  styleUrls: ['./troubles.component.css']
})
export class TroubleComponent implements OnInit {

  public ticket: any;
  public ticketPriorities: any[] = TROUBLE_PRIORITIES;
  public ticketRequestTypes: any[] = TROUBLE_REQUEST_TYPES;
  public statuses: any[] = TROUBLE_REQUEST_STATUSES;
  public model: any = { data: [] };
  public paginationConfig: PaginationInstance = {
    id: "paginationListId",
    itemsPerPage: 5,
    currentPage: 1,
    totalItems: this.model.data.length
  };
  form: FormGroup = null;
  loading = false;
  submitted = false;
  loading2 = false;
  submitted2 = false;
  users: any[] = [];
  constructor(
    private toastr: ToastrService,
    private troubleService: TroubleService,
    private studentService: StudentService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.refreshData();
    this.getStudents();
  }

  public pageChange(event: any): void {
    this.paginationConfig.currentPage = event;
    this.loadData();
  }
  public getStudents(): void {
    this.studentService.getStudentList().subscribe((response) => {
      this.users = response;
    });
  }

  loadData() {
    const query = {
      page: this.paginationConfig.currentPage,
      pageSize: this.paginationConfig.itemsPerPage
    };
    this.troubleService.getTickets(query).subscribe(response => {
      this.model.data = response.data.map((dataItem: any, index: number) => {
        const priority = this.ticketPriorities.find((element1: any) => element1.value === dataItem.priority);
        dataItem.priorityText = priority.title;

        const requestType = this.ticketRequestTypes.find((element1: any) => element1.value === dataItem.requestType);
        dataItem.requestTypeText = requestType.title;

        dataItem.statusText = this.statuses.find((statusElement: any) => statusElement.value === dataItem.status).title;

        if (dataItem.order) {
          dataItem.orderDetails = dataItem.order;
          dataItem.order = dataItem.order._id;
        }
        dataItem.index = index + 1 + (this.paginationConfig.itemsPerPage * (this.paginationConfig.currentPage - 1));
        return dataItem;
      });
      this.paginationConfig.totalItems = response.total || response.data.length;
    });
  }

  public refreshData(): void {
    this.paginationConfig.currentPage = 1;
    this.paginationConfig.itemsPerPage = 5;
    this.loadData();
  }

  onClickViewDetails(ticket: any) {
    this.ticket = ticket;
    $('#viewTroubleDetails').modal({
      show: true
    });
  }

  onClickResolveTicket(ticket: any) {
    this.ticket = ticket;
    this.createForm();
    $('#editTroubleTicket').modal({
      show: true
    });
  }


  createForm() {
    this.form = this.formBuilder.group({
      _id: [this.ticket._id],
      requestType: [this.ticket.requestType || 0, Validators.required],
      priority: [this.ticket.priority || 0, Validators.required],
      order: [this.ticket.order],
      user: [this.ticket.user, Validators.required],
      status: [this.ticket.status || TROUBLE_REQUEST_STATUSES[0].value, Validators.required],
      notes: [this.ticket.notes, Validators.required],
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    this.loading = true;
    this.updateTicket();
    this.submitted = false;
  }

  onSubmit2() {
    this.submitted2 = true;
    if (this.form.invalid) {
      return;
    }
    this.loading2 = true;
    this.addTicket();
    this.submitted2 = false;
  }


  updateTicket() {
    const payload = { ...this.ticket };
    Object.assign(payload, this.form.value);
    Object.assign(payload, { user: this.ticket.user._id });
    this.troubleService.updateTicket(payload).subscribe(() => {
      this.toastr.success("Ticket Updated successfully", 'Success', {
        timeOut: 3000
      });
      this.form.reset();
      this.refreshData();
      $('#editTroubleTicket').modal('toggle');
    });
  }

  addTroubleTicket() {
    this.submitted2 = false;
    this.ticket = {};
    this.createForm();
    $('#CreateTroubleTicket').modal('toggle');
  }

  close() {
    this.submitted2 = false;
    $('#CreateTroubleTicket').modal('toggle');
  }


  addTicket() {
    this.troubleService.addTicket(this.form.value).subscribe(() => {
      this.toastr.success("Ticket created successfully", 'Success', {
        timeOut: 3000
      });
      this.close();
      this.form.reset();
      this.refreshData();
    });
  }

}
