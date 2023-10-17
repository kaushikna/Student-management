import { Component, OnInit } from '@angular/core';
import { PaginationInstance } from 'ngx-pagination';
import { ToastrService } from 'ngx-toastr';
import { TRANSACTION_STATUS, PAYMENT_METHOD, ORDER_STATUS } from 'src/app/metaData/metaData';
import { AuthService } from 'src/app/services/auth.service';
import { OrderService } from 'src/app/services/order.service';
import { PaymentService } from 'src/app/services/payment.service';
declare const $: any;

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {

  public transaction: any;
  public order: any;
  public role: string;
  public model: any = { data: [] };
  public paginationConfig: PaginationInstance = {
    id: "paginationListId",
    itemsPerPage: 5,
    currentPage: 1,
    totalItems: 0
  };
  public paginationConfig2: PaginationInstance = {
    id: "paginationListId2",
    itemsPerPage: 5,
    currentPage: 1,
    totalItems: 0
  };
  public paymentContent: any = {
    admin: {
      text: "Make payment for a student",
      buttonLabel: "Pay Now"
    },
    student: {
      text: "Choose the right plan to become a Active Member",
      buttonLabel: "Become a premium member"
    },
  };
  public disablePaymentButton = false;
  constructor(
    private orderService: OrderService,
    private toastr: ToastrService,
    private authService: AuthService,
    private paymentService: PaymentService) { }

  ngOnInit(): void {
    this.refreshData();
    this.refreshData2();
    const currentUser = this.authService.getUser();
    this.role = currentUser.role;
  }

  public pageChange(event: any): void {
    this.paginationConfig.currentPage = event;
    this.loadData();
  }
  public pageChange2(event: any): void {
    this.paginationConfig2.currentPage = event;
    this.loadData2();
  }


  public loadData() {
    const query = {
      page: this.paginationConfig.currentPage,
      pageSize: this.paginationConfig.itemsPerPage
    };
    this.orderService.getOrders(query).subscribe(response => {
      this.model.data = response.data.map((dataItem: any, index: number) => {
        if (dataItem.user) {
          dataItem.user.fullName = dataItem.user.firstName + " " + dataItem.user.lastName;
        }
        dataItem.status = ORDER_STATUS[dataItem.status];
        dataItem.index = index + 1 + (this.paginationConfig.itemsPerPage * (this.paginationConfig.currentPage - 1));
        dataItem.entity = dataItem.batch.entityId?.title;
        return dataItem;
      });
      this.paginationConfig.totalItems = response.total || response.data.length;

      // if (this.role === "student" && this.model.data.length) {
      //   this.disablePaymentButton = true;
      // }

    });
  }

  public loadData2() {
    const query = {
      page: this.paginationConfig2.currentPage,
      pageSize: this.paginationConfig2.itemsPerPage
    };
    this.orderService.getTransactions(query).subscribe(response => {
      this.model.data2 = response.data.map((dataItem: any, index: number) => {
        dataItem.index = index + 1 + (this.paginationConfig2.itemsPerPage * (this.paginationConfig2.currentPage - 1));
        dataItem.transactionStatus = TRANSACTION_STATUS[dataItem.transactionStatus];
        dataItem.paymentMethod = PAYMENT_METHOD[dataItem.paymentMethod];
        return dataItem;
      });
      this.paginationConfig2.totalItems = response.total || response.data.length;
    });
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

  public onOrderClick(order: any) {
    this.order = order;
    $('#viewOrderDetails').modal({
      show: true,
    });
  }

  public onTransactionClick(transactions: any) {
    
    this.transaction = transactions;
    $('#viewTransactionDetails').modal({
      show: true,
    });
  }

  /**
   * closePayment
   */
  public closePayment() {
    $('#makeapayment').modal('toggle');
  }

  public makePayment(data: any) {
    const cardExpirationDate = data.cardExpirationDate.month + data.cardExpirationDate.year.slice(2, 4);
    this.paymentService.makePayment({ ...data, cardExpirationDate }).subscribe((response) => {
      if (response.error) {
        this.toastr.error(response.error.message, "Payment Failed", {
          timeOut: 3000,
        });
      } else {
        this.toastr.success("", "Paid Successfully", {
          timeOut: 3000,
        });
        this.closePayment();
        this.refreshData();
        this.refreshData2();
      }
    });
  }

}
