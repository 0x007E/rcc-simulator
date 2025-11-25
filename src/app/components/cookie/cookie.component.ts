import { Component, OnInit } from '@angular/core';
import { CookieConsentService } from '../../services/cookie';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CookieModal } from '../../modals/cookie/cookie.modal';

@Component({
  selector: 'app-cookie',
  imports: [],
  templateUrl: './cookie.component.html',
  styleUrl: './cookie.component.css',
})
export class CookieComponent implements OnInit {

  private modalRef?: NgbModalRef;

  constructor(private modalService: NgbModal, private cookieConsentService: CookieConsentService) {}

  ngOnInit() {
    if (!this.cookieConsentService.getConsent()) {
      this.openModal();
    } else if (this.cookieConsentService.getConsent() === 'accepted') {
      this.cookieConsentService.setConsent('accepted');
    }
  }

  openModal() {
    this.modalRef = this.modalService.open(CookieModal, {
      backdrop: 'static',
      keyboard: false,
      centered: true
    });

    this.modalRef.componentInstance.accepted.subscribe(() => {
      this.cookieConsentService.setConsent('accepted');
      this.modalRef?.close();
    });

    this.modalRef.componentInstance.rejected.subscribe(() => {
      this.cookieConsentService.setConsent('rejected');
      this.modalRef?.close();
    });
  }

}
