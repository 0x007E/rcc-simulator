import { Component, OnInit } from '@angular/core';
import { NgbAlert } from "@ng-bootstrap/ng-bootstrap";
import { MatIconModule } from "@angular/material/icon";
import { CubeComponent } from "../cube/cube.component";
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Cube } from '../../classes/cube';
import { Workflow } from '../../classes/workflow';
import { WorkflowService } from '../../services/workflow';
import { CubeService } from '../../services/cube';
import { SequenceMode } from '../../enums/sequence';
import { Position } from '../../enums/position';
import { Runner } from '../../classes/runner';

@Component({
  selector: 'app-power-off.component',
  imports: [TranslateModule, NgbAlert, MatIconModule, CubeComponent],
  templateUrl: './power-off.component.html',
  styleUrl: './power-off.component.css',
})
export class PowerOffComponent implements OnInit {

  private workflow!: Workflow;
  protected runner!: Runner;

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
      this.runner = new Runner(workflow, this.cubeService);
      this.resetCube();
    });
  }
  
  buttonResetClick() {
    this.runner.cancel();
    this.runner.ButtonDisabled = false;
    this.cubeService.Cube.OverlayVisible = this.workflow.Initial.OverlayVisible;
    this.resetCube();
  }

  public get formattedTime(): string {
    const min = Math.floor(this.runner.TimePassed/60);
    const sec = Math.floor(this.runner.TimePassed%60);
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  }

  onButtonPress() {
    this.runner.ButtonReleased = false;

    if(this.cubeService.Cube.OverlayVisible == true) {
      this.cubeService.Cube.OverlayVisible = false;
      return;
    }

    if(this.runner.ButtonDisabled) {
      return;
    }

    this.runner.start();
    this.runner.run().then(() => {

      if(this.runner.FinalReached) {
        this.runner.stop();
        this.runner.ButtonDisabled = this.workflow.Final.Disabled;
        this.cubeService.setUp(this.workflow.Final);
      }
    }); 
  }

  onButtonRelease() {
    this.runner.ButtonReleased = true;

    if(this.runner.ButtonDisabled) {
      return;
    }
    
    this.runner.cancel()
    this.resetCube();
    this.cubeService.Cube.OverlayVisible = false;
  }
}
