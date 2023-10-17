import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-smart-modal',
  templateUrl: './smart-modal.component.html',
  styleUrls: ['./smart-modal.component.css']
})
export class SmartModalComponent implements OnInit {

  @ViewChild('content', { static: true }) modal: ElementRef;
  public modalClose: NgbActiveModal;
  @Input() modalTitle: any;
  constructor(public modalService: NgbModal) { }

  ngOnInit() {
  }
  open(size?: string) {
    this.modalClose = this.modalService.open(this.modal, { windowClass: 'modal-wrapper', size });
  }


  close() {
    this.modalClose.close();
  }

}
