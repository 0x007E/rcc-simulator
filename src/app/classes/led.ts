import { Color } from "./color";

export class LED {
  private color!: Color;
  private opacity!: boolean;

  constructor() {
    this.color = new Color('#FFFFFF');
  }

  public get Color(): Color {
    return this.color;
  }
  public set Color(color: Color) {
    if (!color || !(color instanceof Color)) {
      throw new Error('Color is not valid!');
    }
    this.color = color;
  }

  public get Opacity(): boolean {
    return this.opacity;
  }
  public set Opacity(opacity: boolean) {
    this.opacity = opacity;
  }
}
