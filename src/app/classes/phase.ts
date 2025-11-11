export class Phase {

  private color: string[];
  private opacity: boolean;
  private overlay: boolean;

  constructor(color: string[] = [], opacity = false, overlay = false) {
    this.color = color;
    this.opacity = opacity;
    this.overlay = overlay;
  }

  public get Color(): string[] {
    return this.color;
  }
  public set Color(color: string[]) {
    if (!color || !(color instanceof Array) || !color.every(c => typeof c === 'string')) {
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

  public get OverlayVisible(): boolean {
    return this.overlay;
  }
  public set OverlayVisible(overlay: boolean) {
    this.overlay = overlay;
  }
}