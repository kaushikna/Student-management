import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-alertnotification',
  templateUrl: './alertnotification.component.html',
  styleUrls: ['./alertnotification.component.css']
})
export class AlertnotificationComponent implements OnInit {

  constructor() { }

  @Input() message;
  @Input() type;

  ngOnInit() {
  }

}
