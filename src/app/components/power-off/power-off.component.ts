import { Component, OnInit } from '@angular/core';
import { NgbAlert } from "@ng-bootstrap/ng-bootstrap";
import { MatIconModule } from "@angular/material/icon";
import { CubeComponent } from "../cube/cube.component";
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Cube } from '../../classes/cube';
import { Workflow } from '../../classes/workflow';
import { WorkflowService } from '../../services/workflow';
import { CubeService, Position } from '../../services/cube';
import { SequenceMode } from '../../enums/sequence';

@Component({
  selector: 'app-power-off.component',
  imports: [TranslateModule, NgbAlert, MatIconModule, CubeComponent],
  templateUrl: './power-off.component.html',
  styleUrl: './power-off.component.css',
})
export class PowerOffComponent implements OnInit {

  private workflow!: Workflow;

  private timePassed: number = 0;

  private buttonDisabled: boolean = false;
  private buttonReleased: boolean = false;
  private sequenceRunning: boolean = false;
  private finalReached: boolean = false;

  constructor(
    private translate: TranslateService,
    private cubeService: CubeService,
    private workflowService: WorkflowService) {

        this.cubeService.reset();

        this.translate.get('app.global.click').subscribe((text: string) => {
          this.cubeService.Cube.OverlayText = text;
        });

        this.workflowService.setFile('data/power_off.json');
  }

  public get Cube(): Cube {
    return this.cubeService.Cube;
  }

  private resetCube() {
    this.cubeService.setUp(this.workflow.Initial);
  }

  ngOnInit(): void {
    this.workflowService.Workflow.subscribe(workflow => {
      this.workflow = workflow;
      this.cubeService.Cube.OverlayVisible = this.workflow.Initial.OverlayVisible;
      this.resetCube();
    });
  }
  
  buttonResetClick() {
    
    this.sequenceRunning = false;
    this.cubeService.Cube.OverlayVisible = this.workflow.Initial.OverlayVisible;
    this.buttonDisabled = false;
    this.resetCube();
  }

  public get formattedTime(): string {
    const min = Math.floor(this.timePassed/60);
    const sec = Math.floor(this.timePassed%60);
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  }

  async runSequence(index: number = 0): Promise<any> {
    if (!this.sequenceRunning) {
      return;
    } else if (index >= this.workflow.Sequence.length) {
      this.finalReached = true;
      return;
    }

    const sequence = this.workflow.Sequence[index];
    let count = 0;
    let nextColorIndex = 0;
    
    this.cubeService.setOpacity(Position.Both, false);

    return new Promise<void>((resolve) => {

      this.buttonDisabled = sequence.Blocked;

      if(sequence.Color.length >= 2) {
        this.cubeService.setColor(Position.Left, sequence.Color[0]);
        this.cubeService.setColor(Position.Right, sequence.Color[1]);

        if(sequence.Variable) {
          this.cubeService.setOpacity(Position.Left, true);
          this.cubeService.setOpacity(Position.Right, false);
        } else {
          this.cubeService.setOpacity(Position.Both, true);
        }
      }

      const timerId = setInterval(() => {
        
        switch(sequence.Mode) {
          case SequenceMode.Interval:

            // console.log('Interval mode: count=' + count + ', interval=' + sequence.Interval);

            if(!((count + 1) % (sequence.Color.length * sequence.Interval + 1))) {
              
              this.cubeService.setOpacity(Position.Both, false);
              
              clearInterval(timerId);
              resolve();
            }

            if(count > 0)
            {

              let lastOpacityLeft = this.cubeService.Cube.LeftLED.Opacity;
              let lastOpacityRight = this.cubeService.Cube.RightLED.Opacity;

              this.cubeService.Cube.LeftLED.Opacity = false;
              this.cubeService.Cube.RightLED.Opacity = false;

              if(!((count + 1)%(sequence.Interval * 2))) {
                nextColorIndex++;
                // console.log('Next color index: ' + nextColorIndex);

                if(nextColorIndex < (sequence.Color.length / 2)) {
                  this.cubeService.setColor(Position.Left, sequence.Color[(nextColorIndex * 2)]);
                  this.cubeService.setColor(Position.Right, sequence.Color[(nextColorIndex * 2 + 1)]);
                }
              }
              
              this.cubeService.Cube.LeftLED.Opacity = !lastOpacityLeft;
              this.cubeService.Cube.RightLED.Opacity = !lastOpacityRight;
            }

            break;
          case SequenceMode.Timeout:

            // console.log('Timeout mode: count=' + count + ', interval=' + sequence.Interval + ', timePassed=' + this.timePassed);
            
            this.timePassed++;

            if(count >= sequence.Interval) {

              this.timePassed = 0;
              clearInterval(timerId);
              resolve();

            } else {
              if(!sequence.Blocked && this.buttonReleased) {
              
                // console.log('Resetting sequence due to button release.' + this.buttonReleased);
                
                this.sequenceRunning = false;
                this.resetCube();
                clearInterval(timerId);
                resolve();
              }
            }

          break;
        }
        count++;
      }, sequence.Delay);
    }).then(() => this.runSequence(index + 1));
  }

  onButtonPress() {
    this.buttonReleased = false;

    if(this.cubeService.Cube.OverlayVisible == true) {
      this.cubeService.Cube.OverlayVisible = false;
      return;
    }

    if(this.buttonDisabled) {
      return;
    }

    this.sequenceRunning = true;
    this.finalReached = false;
    this.runSequence().then(() => {

      if(this.finalReached) {
        this.sequenceRunning = false;
        this.buttonDisabled = this.workflow.Final.Disabled;

        this.cubeService.setUp(this.workflow.Final);
      }
    }); 
  }

  onButtonRelease() {
    this.buttonReleased = true;

    if(this.buttonDisabled) {
      return;
    }
    
    this.sequenceRunning = false;
    this.resetCube();
  }
}
