import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-error.component',
  imports: [ TranslateModule, NgbAlert, MatIcon ],
  templateUrl: './error.component.html',
  styleUrl: './error.component.css',
})
export class ErrorComponent {

}
