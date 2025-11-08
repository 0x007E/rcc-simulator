import { LED } from "./led";

export class Cube {
  private overlayText!: string;
  private overlayVisible: boolean = true;
  private leftLED!: LED;
  private rightLED!: LED;

  constructor(overlayText: string) {
    this.OverlayText = overlayText;
  }

  public get OverlayText(): string {
    return this.overlayText;
  }
  public set OverlayText(text: string) {
    if (text.trim().length === 0) {
      throw new Error('OverlayText is not valid!');
    }
    this.overlayText = text;
  }

  public get LeftLED(): LED {
    return this.leftLED;
  }
  public set LeftLED(led: LED) {
    this.leftLED = led;
  }

  public get RightLED(): LED {
    return this.rightLED;
  }
  public set RightLED(led: LED) {
    this.rightLED = led;
  }

  public get OverlayVisible(): boolean {
    return this.overlayVisible;
  }
  public set OverlayVisible(visible: boolean) {
    this.overlayVisible = visible;
  }
}
