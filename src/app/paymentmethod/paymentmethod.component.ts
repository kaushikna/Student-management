import { Component, OnInit } from '@angular/core';

declare const $: any;

@Component({
  selector: 'app-paymentmethod',
  templateUrl: './paymentmethod.component.html',
  styleUrls: ['./paymentmethod.component.css']
})
export class PaymentmethodComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  public Card() :void {
    $('#Card').modal({
      show: true
    });
  }
  public newpayment() :void {
    $('#choosepayment').modal({
      show: true
    });
  }
  public Removepayment() :void {
    $('#removepayment').modal({
      show: true
    });
  }
}
