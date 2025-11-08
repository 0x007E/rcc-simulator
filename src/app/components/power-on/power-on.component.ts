import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from "@angular/material/icon";
import { NgbAlert } from "@ng-bootstrap/ng-bootstrap";
import { CubeComponent } from "../cube/cube.component";
import { Color } from '../../classes/color';
import { Cube } from '../../classes/cube';
import { LED } from '../../classes/led';


@Component({
  selector: 'app-power-on.component',
  imports: [CubeComponent, FormsModule, MatIconModule, NgbAlert],
  templateUrl: './power-on.component.html',
  styleUrl: './power-on.component.css',
})
export class PowerOnComponent {
  
  private cube!: Cube;
  public selectedColor: string = 'red';

  constructor() {
    this.Cube = new Cube('Click to start');
    this.cube.LeftLED = new LED();
    this.cube.RightLED = new LED();

    this.Cube.LeftLED.Color = new Color('#ffffff');
    this.Cube.RightLED.Color = new Color('#ffffff');
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

  intervalId: any;

  public onColorChange() {
    if(this.selectedColor === 'green') {
      this.Cube.LeftLED.Color = new Color('#00ff00');
      this.Cube.RightLED.Color = new Color('#00ff00');
    } else if(this.selectedColor === 'red') { 
      this.Cube.LeftLED.Color = new Color('#ff0000');
      this.Cube.RightLED.Color = new Color('#ff0000');
    }
  }

  public buttonResetClick() {
    clearInterval(this.intervalId);

    this.onColorChange();

    this.Cube.OverlayVisible = true;
    this.Cube.LeftLED.Opacity = false;
    this.Cube.RightLED.Opacity = false;
  }

  public handleImageClick() {

    this.Cube.OverlayVisible = false;
    this.Cube.LeftLED.Opacity = false;
    this.Cube.RightLED.Opacity = false;

    this.onColorChange();

    clearInterval(this.intervalId);

    this.Cube.LeftLED.Opacity = !this.Cube.LeftLED.Opacity;

    let count = 1;
    const maxCount = 6;
    this.intervalId = setInterval(() => {
      
      this.Cube.LeftLED.Opacity = !this.Cube.LeftLED.Opacity;
      this.Cube.RightLED.Opacity = !this.Cube.RightLED.Opacity;

      if ((++count) > maxCount) {
        clearInterval(this.intervalId);
        
        this.Cube.LeftLED.Color = new Color('#FF00FF');
        this.Cube.RightLED.Color = new Color('#00FFFF');
        this.Cube.LeftLED.Opacity = true;
        this.Cube.RightLED.Opacity = true;
      }
    }, 500);
  }
}
