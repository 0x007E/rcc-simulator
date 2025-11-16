import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from "@angular/material/icon";
import { NgbAlert } from "@ng-bootstrap/ng-bootstrap";
import { CubeComponent } from "../cube/cube.component";
import { TranslateService } from '@ngx-translate/core';
import { CubeManager } from '../../classes/cube-manager';
import { Workflow } from '../../classes/workflow';
import { Position } from '../../enums/position';
import { Phase } from '../../classes/phase';


@Component({
  selector: 'app-power-on.component',
  imports: [CubeComponent, FormsModule, MatIconModule, NgbAlert],
  templateUrl: './power-on.component.html',
  styleUrl: './power-on.component.css',
})
export class PowerOnComponent implements OnInit {
  
  public selectedColor: string = 'red';

  protected manager!: CubeManager;
  private workflow!: Workflow;

  constructor(
    private translate: TranslateService) {

        this.workflow = new Workflow();
        this.workflow.Delay = 500;
        this.workflow.Interval = 2;

        this.manager = new CubeManager();
        this.manager.reset();

        this.translate.get('app.global.click').subscribe((text: string) => {
          this.manager.Cube.OverlayText = text;
        });
  }

  ngOnInit(): void {
    this.buttonResetClick();
  }

  intervalId: any;

  public buttonResetClick() {
    clearInterval(this.intervalId);

    this.manager.reset();
    this.workflow.reset();

    let batteryOK: Phase =  new Phase(['#00FF00', '#00FF00'], false, true);
    let batteryFault: Phase =  new Phase(['#FF0000', '#FF0000'], false, true);

    if(this.selectedColor === 'green') {
      this.manager.setUp(batteryOK);
    } else if(this.selectedColor === 'red') {
      this.manager.setUp(batteryFault);
    }
  }

  public imageClick() {

    if(this.manager.Cube.OverlayVisible){
      this.manager.Cube.OverlayVisible = false;
      return;
    } else if (this.workflow.Finished) {
      this.buttonResetClick();
      return;
    } else if (this.workflow.Blocked) {
      return;
    }

    clearInterval(this.intervalId);

    this.workflow.Blocked = true;

    let intervalCount = 0;
    const maxIntervalCount = this.workflow.Interval * 2;

    this.intervalId = setInterval(() => {
      
      if(intervalCount >= maxIntervalCount) {
        let final: Phase =  new Phase(['#FF00FF', '#00FFFF'], true, false);

        this.manager.setUp(final);
        this.workflow.Finished = true;
        clearInterval(this.intervalId);
        return;
      }

      if(intervalCount == 0) { 
        this.manager.toggleOpacity(Position.Left)
      } else {
        this.manager.toggleOpacity(Position.Both)
      }

      intervalCount++;
    }, this.workflow.Delay);
  }
}
