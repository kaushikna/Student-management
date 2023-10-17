
import { Component, OnInit } from '@angular/core';
import { PaginationInstance } from 'ngx-pagination';
import { OrderService } from 'src/app/services/order.service';
declare const $: any;

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent implements OnInit {

  public transaction: any;
  public model: any = { data: [] };
  public paginationConfig: PaginationInstance = {
    id: "paginationListId",
    itemsPerPage: 5,
    currentPage: 1,
    totalItems: this.model.data.length
  };
  constructor(private orderService: OrderService) { }

  ngOnInit(): void {
    this.refreshData();
  }

  public pageChange(event: any): void {
    this.paginationConfig.currentPage = event;
    this.loadData();
  }

  loadData() {
    const query = {
      page: this.paginationConfig.currentPage,
      pageSize: this.paginationConfig.itemsPerPage
    };
    this.orderService.getTransactions(query).subscribe(response => {
      this.model.data = response.data.map((dataItem: any, index: number) => {
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


  onOrderClick(transaction: any) {
    this.transaction = transaction;
    $('#viewTransactionDetails').modal({
      show: true
    });
  }

}
