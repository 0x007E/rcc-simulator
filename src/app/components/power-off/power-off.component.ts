import { Component, OnInit } from '@angular/core';
import { NgbAlert } from "@ng-bootstrap/ng-bootstrap";
import { MatIconModule } from "@angular/material/icon";
import { CubeComponent } from "../cube/cube.component";
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Workflow } from '../../classes/workflow';
import { CubeManager } from '../../classes/cube-manager';
import { Phase } from '../../classes/phase';
import { Position } from '../../enums/position';

@Component({
  selector: 'app-power-off.component',
  imports: [TranslateModule, NgbAlert, MatIconModule, CubeComponent],
  templateUrl: './power-off.component.html',
  styleUrl: './power-off.component.css',
})
export class PowerOffComponent implements OnInit {

  protected manager!: CubeManager;
  private workflow!: Workflow;

  constructor(
    private translate: TranslateService
  ) {

      this.manager = new CubeManager();
      this.manager.reset();

      this.translate.get('app.global.click').subscribe((text: string) => {
        this.manager.Cube.OverlayText = text;
      });
    }

  public ngOnInit(): void {
    this.buttonResetClick();
  }

  public intervalTime: number = 0;

  public get formattedTime(): string {
    const min = Math.floor(this.intervalTime/60);
    const sec = Math.floor(this.intervalTime%60);
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  }

  intervalId: any;

  public buttonResetClick() {

    clearInterval(this.intervalId);

    this.workflow = new Workflow();
    this.workflow.Delay = 500;
    this.workflow.Interval = 2;

    this.intervalTime = 0;

    this.manager.reset();
    this.workflow.reset();

    let initial: Phase =  new Phase(['#FF00FF', '#00FFFF'], true, true);
    this.manager.setUp(initial);
  }

  public onButtonPress() {
    if(this.manager.Cube.OverlayVisible){
      this.manager.Cube.OverlayVisible = false;
      return;
    } else if (this.workflow.Finished) {
      return;
    } else if (this.workflow.Blocked) {
      return;
    }

    this.workflow.Blocked = true;

    let intervalCount = 0;
    let maxIntervalCount = this.workflow.Interval * 2;

    let initial: Phase =  new Phase(['#00ff00', '#00ff00'], false, false);
    let final: Phase =  new Phase(['#000000', '#000000'], false, false);
    this.manager.setUp(initial);

    this.intervalId = setInterval(() => {
      
      if(intervalCount >= maxIntervalCount) {

        clearInterval(this.intervalId);

        this.manager.setUp(final);
        
        this.workflow.Blocked = false;
        this.workflow.Delay = 1000;
        this.workflow.Interval = 5;

        this.intervalId = setInterval(() => {
          
          if(this.workflow.Released) {
            clearInterval(this.intervalId);
            
            this.buttonResetClick();
            this.manager.Cube.OverlayVisible = false;

            return;
          }
          this.intervalTime++;

          if(this.intervalTime > this.workflow.Interval) {

            clearInterval(this.intervalId);

            let shutdown: Phase[] =  [
              new Phase(['#00ff00', '#00ff00'], false, false),
              new Phase(['#ffff00', '#ffff00'], false, false),
              new Phase(['#ff0000', '#ff0000'], false, false)
            ];

            this.manager.setUp(shutdown[0]);
            
            this.workflow.Blocked = true;
            this.workflow.Delay = 500;
            this.workflow.Interval = 2;
            
            intervalCount = 0;
            let shutdownColorIndex = 0;

            this.intervalId = setInterval(() => {
              
              if(intervalCount >= (this.workflow.Interval * shutdown.length)) {
                clearInterval(this.intervalId);
                
                this.buttonResetClick();

                this.manager.setOpacity(Position.Both, false);
                this.manager.Cube.OverlayVisible = false;
                this.workflow.Finished = true;
                return;
              }

              if(intervalCount == 0) { 
                this.manager.toggleOpacity(Position.Left)
              } else {

                if(intervalCount % this.workflow.Interval == 0) {
                  shutdownColorIndex++;

                  this.manager.setColor(Position.Both, shutdown[shutdownColorIndex].Color[0]);
                }

                this.manager.toggleOpacity(Position.Both)
              }

              intervalCount++;

            }, this.workflow.Delay);
          }

        }, this.workflow.Delay);

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

  public onButtonRelease() {
    this.workflow.Released = true;

    if (this.workflow.Blocked || this.workflow.Finished) {
      return;
    }

    this.buttonResetClick();
    this.manager.Cube.OverlayVisible = false;
  }
}
