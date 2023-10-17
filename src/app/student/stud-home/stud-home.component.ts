import { Component,OnInit } from '@angular/core';
declare const $: any;

@Component({
  selector: 'app-stud-home',
  templateUrl: './stud-home.component.html',
  styleUrls: ['./stud-home.component.css']
})
export class StudHomeComponent implements OnInit {

 
  constructor() { 

}

ngOnInit(): void {
  
}
 
public Payment(): void {
  $('#PaymentTab').modal({
    show: true
  });
}


}
