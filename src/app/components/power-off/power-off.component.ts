import { Component, OnInit } from '@angular/core';
import { NgbAlert } from "@ng-bootstrap/ng-bootstrap";
import { MatIconModule } from "@angular/material/icon";
import { Cube } from '../../classes/cube';
import { LED } from '../../classes/led';
import { Color } from '../../classes/color';
import { CubeComponent } from "../cube/cube.component";
import { Sequence, SequenceMode } from '../../classes/sequence';
import { HttpClient } from '@angular/common/http';
import { Initial } from '../../classes/initial';
import { Final } from '../../classes/final';
import { Router } from '@angular/router';

@Component({
  selector: 'app-power-off.component',
  imports: [CubeComponent, NgbAlert, MatIconModule],
  templateUrl: './power-off.component.html',
  styleUrl: './power-off.component.css',
})
export class PowerOffComponent implements OnInit {

  private cube!: Cube;

  private sequenceData!: Sequence[];
  private initialData!: Initial;
  private finalData!: Final;

  private timePassed: number = 0;

  private buttonDisabled: boolean = false;
  private buttonReleased: boolean = false;
  private sequenceRunning: boolean = false;
  private finalReached: boolean = false;

  constructor(
    private router: Router,
    private http: HttpClient) {
        this.Cube = new Cube('Click to start');
        this.Cube.LeftLED = new LED();
        this.Cube.RightLED = new LED();
  }

  private resetCube() {
    this.Cube.LeftLED.Opacity = this.initialData.Opacity;
    this.Cube.RightLED.Opacity = this.initialData.Opacity;
    this.Cube.LeftLED.Color = new Color(this.initialData.Color[0]);
    this.Cube.RightLED.Color = new Color(this.initialData.Color[1]);
  }

  ngOnInit(): void {
    this.http.get<any>('data/power_off.json').subscribe({
    next: jsonData => {
      this.sequenceData = jsonData.Sequence as Sequence[];
      this.initialData = jsonData.Initial as Initial;
      this.finalData = jsonData.Final as Final;
      this.Cube.OverlayVisible = this.initialData.OverlayVisible;
      this.resetCube();
    },
    error: error => {
      this.router.navigate(['/error?error=' + error.message]);
    }});
  }

  public get Cube() : Cube {
    return this.cube;
  }

  private set Cube(cube : Cube) {
    if(!cube || !(cube instanceof Cube)) {
      throw new Error('Cube is not valid!');
    }
    this.cube = cube;
  }


  buttonResetClick() {
    
    this.sequenceRunning = false;
    this.Cube.OverlayVisible = this.initialData.OverlayVisible;
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
    } else if (index >= this.sequenceData.length) {
      this.finalReached = true;
      return;
    }

    const sequence = this.sequenceData[index];
    let count = 0;
    let nextColorIndex = 0;
    
    this.Cube.LeftLED.Opacity = false;
    this.Cube.RightLED.Opacity = false;

    return new Promise<void>((resolve) => {

      this.buttonDisabled = sequence.Blocked;

      if(sequence.Color.length >= 2) {
        this.Cube.LeftLED.Color = new Color(sequence.Color[0]);
        this.Cube.RightLED.Color = new Color(sequence.Color[1]);

        if(sequence.Variable) {
          this.Cube.LeftLED.Opacity = true;
          this.Cube.RightLED.Opacity = false;
        } else {
          this.Cube.LeftLED.Opacity = true;
          this.Cube.RightLED.Opacity = true;
        }
      }

      const timerId = setInterval(() => {
        
        switch(sequence.Mode) {
          case SequenceMode.Interval:

            console.log('Interval mode: count=' + count + ', interval=' + sequence.Interval);

            if(!((count + 1) % (sequence.Color.length * sequence.Interval + 1))) {
              
              this.Cube.LeftLED.Opacity = false;
              this.Cube.RightLED.Opacity = false;
              
              resolve();
              clearInterval(timerId);
            }

            if(count > 0)
            {
              let lastOpacityLeft = this.Cube.LeftLED.Opacity;
              let lastOpacityRight = this.Cube.RightLED.Opacity;

              this.Cube.LeftLED.Opacity = false;
              this.Cube.RightLED.Opacity = false;

              if(!((count + 1)%(sequence.Interval * 2))) {
                nextColorIndex++;
                console.log('Next color index: ' + nextColorIndex);

                if(nextColorIndex < (sequence.Color.length / 2)) {
                  this.Cube.LeftLED.Color = new Color(sequence.Color[(nextColorIndex * 2)]);
                  this.Cube.RightLED.Color = new Color(sequence.Color[(nextColorIndex * 2 + 1)]);
                }
              }
              
              this.Cube.LeftLED.Opacity = !lastOpacityLeft;
              this.Cube.RightLED.Opacity = !lastOpacityRight;
            }

            break;
          case SequenceMode.Timeout:

            console.log('Timeout mode: count=' + count + ', interval=' + sequence.Interval + ', timePassed=' + this.timePassed);
            
            this.timePassed++;

            if(count >= sequence.Interval) {

              this.timePassed = 0;
              clearInterval(timerId);
              resolve();

            } else {
              if(!sequence.Blocked && this.buttonReleased) {
              
                console.log('Resetting sequence due to button release.' + this.buttonReleased);
                
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

    if(this.Cube.OverlayVisible == true) {
      this.Cube.OverlayVisible = false;
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
        this.buttonDisabled = this.finalData.Disabled;
        this.Cube.LeftLED.Opacity = this.finalData.Opacity;
        this.Cube.RightLED.Opacity = this.finalData.Opacity;
        this.Cube.LeftLED.Color = new Color(this.finalData.Color[0]);
        this.Cube.RightLED.Color = new Color(this.finalData.Color[1]);
        this.cube.OverlayVisible = this.finalData.OverlayVisible;
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
