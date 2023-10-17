import { Component, Injectable, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ModalConfig } from './modal.config';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-smart-modal2',
  templateUrl: './smart-modal2.component.html',
  styleUrls: ['./smart-modal2.component.scss']
})
@Injectable()
export class SmartModal2Component implements OnInit {
  @Input() public modalConfig: ModalConfig;
  @ViewChild('modal') private modalContent: TemplateRef<SmartModal2Component>;
  private modalRef: NgbModalRef;

  constructor(private modalService: NgbModal) { }

  ngOnInit(): void { }

  open() {
    this.modalRef = this.modalService.open(this.modalContent, { size: this.modalConfig.size });
    this.modalRef.result.then();
  }

  close() {
    this.modalRef.close();
  }

  dismiss() {
    this.modalRef.dismiss();
  }
}
