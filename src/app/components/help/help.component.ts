import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-help.component',
  imports: [ TranslateModule, NgbAlert, MatIconModule ],
  templateUrl: './help.component.html',
  styleUrl: './help.component.css',
})
export class HelpComponent {

  constructor(
    private translate: TranslateService
  ) { }

}
