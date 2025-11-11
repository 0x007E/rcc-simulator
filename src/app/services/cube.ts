import { Injectable } from '@angular/core';
import { Cube } from '../classes/cube';
import { LED } from '../classes/led';
import { Color } from '../classes/color';
import { Phase } from '../classes/phase';
import { Position } from '../enums/position';

@Injectable({
  providedIn: 'root',
})
export class CubeService {
  private cube!: Cube;

  constructor() {
      this.cube = new Cube('Default');
      this.cube.LeftLED = new LED();
      this.cube.RightLED = new LED();
  }

  public get Cube(): Cube {
    return this.cube;
  }

  public reset() {
    this.Cube.OverlayVisible = false;
    this.Cube.OverlayText = 'Default';

    this.setColor(Position.Both, '#FFFFFF');
    this.setOpacity(Position.Both, false);
  }

  public setUp(parameter: Phase) {
    this.cube.OverlayVisible = parameter.OverlayVisible;

    this.cube.LeftLED.Opacity = parameter.Opacity;
    this.cube.RightLED.Opacity = parameter.Opacity;

    if(parameter.Color.length >= 2) {
      this.cube.LeftLED.Color = new Color(parameter.Color[0]);
      this.cube.RightLED.Color = new Color(parameter.Color[1]);
    }
  }

  public setColor(position: Position, color: string) {
    if (position === Position.Left) {
      this.cube.LeftLED.Color = new Color(color);
    } else if (position === Position.Right) {
      this.cube.RightLED.Color = new Color(color);
    } else if (position === Position.Both) {
      this.cube.LeftLED.Color = new Color(color);
      this.cube.RightLED.Color = new Color(color);
    }
  }

  public setOpacity(position: Position, opacity: boolean) {
    if (position === Position.Left) {
      this.cube.LeftLED.Opacity = opacity;
    } else if (position === Position.Right) {
      this.cube.RightLED.Opacity = opacity;
    } else if (position === Position.Both) {
      this.cube.LeftLED.Opacity = opacity;
      this.cube.RightLED.Opacity = opacity;
    }
  }

  public toggleOpacity(position: Position) {
    if (position === Position.Left) {
      this.cube.LeftLED.Opacity = !this.cube.LeftLED.Opacity;
    } else if (position === Position.Right) {
      this.cube.RightLED.Opacity = !this.cube.RightLED.Opacity;
    } else if (position === Position.Both) {
      this.cube.LeftLED.Opacity = !this.cube.LeftLED.Opacity;
      this.cube.RightLED.Opacity = !this.cube.RightLED.Opacity;
    }
  }
}

export { Position };
