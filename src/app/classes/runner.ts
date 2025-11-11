import { Position } from "../enums/position";
import { SequenceMode } from "../enums/sequence";
import { CubeService } from "../services/cube";
import { Workflow } from "./workflow";

export class Runner {
  private workflow: Workflow;
  private timePassed: number = 0;
  private buttonDisabled: boolean = false;
  private buttonReleased: boolean = false;
  private sequenceRunning: boolean = false;
  private finalReached: boolean = false;

  private cubeService: CubeService;

  constructor(
    workflow: Workflow,
    cubeService: CubeService
  ) {
    this.workflow = workflow;
    this.cubeService = cubeService;
  }

  public get FinalReached(): boolean {
    return this.finalReached;
  }

  public get ButtonDisabled(): boolean {
    return this.buttonDisabled;
  }
  public set ButtonDisabled(value: boolean) {
    this.buttonDisabled = value;
  }

  public get ButtonReleased(): boolean {
    return this.buttonReleased;
  }
  public set ButtonReleased(value: boolean) {
    this.buttonReleased = value;
  }

  public get TimePassed(): number {
    return this.timePassed;
  }

  public cancel() {
    this.sequenceRunning = false;
    this.timePassed = 0;
  }

  public stop() {
    this.sequenceRunning = false;
  }

  public start() {
    this.sequenceRunning = true;
    this.finalReached = false;
  }

  async run(index: number = 0): Promise<any> {
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
                  this.cubeService.setUp(this.workflow.Initial);
                  clearInterval(timerId);
                  resolve();
                }
              }
  
            break;
          }
          count++;
        }, sequence.Delay);
      }).then(() => this.run(index + 1));
    }
}
