import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PaginationInstance } from 'ngx-pagination';
import { ToastrService } from 'ngx-toastr';
import { TROUBLE_PRIORITIES, TROUBLE_REQUEST_STATUSES, TROUBLE_REQUEST_TYPES } from 'src/app/metaData/metaData';
import { OrderService } from 'src/app/services/order.service';
import { TroubleService } from 'src/app/services/trouble.service';
declare const $: any;

@Component({
  selector: 'app-student-troubles',
  templateUrl: './student-troubles.component.html',
  styleUrls: ['./student-troubles.component.css']
})
export class StudentTroublesComponent implements OnInit {

  public orders: any[] = [];
  public ticketPriorities: any[] = TROUBLE_PRIORITIES;
  public ticketRequestTypes: any[] = TROUBLE_REQUEST_TYPES;
  public statuses: any[] = TROUBLE_REQUEST_STATUSES;
  public ticket: any = {};
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
  constructor(
    private toastr: ToastrService,
    private orderService: OrderService,
    private formBuilder: FormBuilder,
    private troubleService: TroubleService) { }

  ngOnInit(): void {
    this.refreshData();
    this.getOrders();
    this.createForm();
  }

  get f() { return this.form.controls; }

  public pageChange(event: any): void {
    this.paginationConfig.currentPage = event;
    this.loadData();
  }

  loadData() {
    const query = {
      page: this.paginationConfig.currentPage,
      pageSize: this.paginationConfig.itemsPerPage
    };

    this.troubleService.getTickets(query).subscribe(response => {
      this.model.data = response.data.map((dataItem: any, index: number) => {
        const priority = this.ticketPriorities.find((element1: any) => element1.value === dataItem.priority);
        dataItem.priority = priority.title;

        const requestType = this.ticketRequestTypes.find((element1: any) => element1.value === dataItem.requestType);
        dataItem.requestType = requestType.title;

        dataItem.status = this.statuses.find((statusElement: any) => statusElement.value === dataItem.status).title;

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


  getOrders() {
    this.orderService.getOrders().subscribe((response: any) => {
      this.orders = response.data;
    });
  }

  onClickViewDetails(ticket: any) {
    this.ticket = ticket;
    $('#viewTroubleDetails').modal({
      show: true
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    this.loading = true;
    this.addTicket();
    this.submitted = false;
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


  createForm() {
    this.form = this.formBuilder.group({
      _id: [this.ticket._id],
      requestType: [this.ticket.requestType || '', Validators.required],
      priority: [this.ticket.priority || '', Validators.required],
      order: [this.ticket.order],
      notes: [this.ticket.notes, Validators.required],
    });
  }

  addTroubleTicket() {
    this.submitted = false;
    $('#CreateTroubleTicket').modal('toggle');
  }

  close() {
    this.submitted = false;
    $('#CreateTroubleTicket').modal('toggle');
  }

}
