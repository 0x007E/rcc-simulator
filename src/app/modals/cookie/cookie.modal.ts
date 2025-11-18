import { Component, EventEmitter, Output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-cookie-modal',
  imports: [ TranslateModule ],
  templateUrl: './cookie.modal.html',
  styleUrl: './cookie.modal.css',
})
export class CookieModal {
  @Output() accepted = new EventEmitter<void>();
  @Output() rejected = new EventEmitter<void>();

  public onAccept() {
    this.accepted.emit();
  }

  public onReject() {
    this.rejected.emit();
  }

}
