export class Color {
  private r!: number;
  private g!: number;
  private b!: number;

  constructor(hex: string) {
    let temp = hex.replace('#', '');

    if (temp.length === 3) {
      temp = temp.split('').map(ch => ch + ch).join('');
    }
    if (temp.length !== 6) {
      throw new Error(`${hex} Hex value must be 6 digits`);
    }

    this.checkIfHexValueIsNumber(temp, `${hex} is not a valid hex number!`);

    if (temp.length !== 6) {
      throw new Error(`${hex} value cannot be resolved!`);
    }

    this.R = parseInt(temp.slice(0, 2), 16);
    this.G = parseInt(temp.slice(2, 4), 16);
    this.B = parseInt(temp.slice(4, 6), 16);
  }

  private checkIfHexValueIsNumber(value: string, error: string): void {
    const num = Number('0x' + value);
    if (isNaN(num)) {
      throw new Error(error);
    }
  }

  public get R(): number {
    return this.r;
  }
  public set R(r: number) {
    if (isNaN(r) || r < 0 || r > 255) {
      throw new Error('R is not a valid number or out of range (0-255)!');
    }
    this.r = r;
  }

  public get G(): number {
    return this.g;
  }
  public set G(g: number) {
    if (isNaN(g) || g < 0 || g > 255) {
      throw new Error('G is not a valid number or out of range (0-255)!');
    }
    this.g = g;
  }

  public get B(): number {
    return this.b;
  }
  public set B(b: number) {
    if (isNaN(b) || b < 0 || b > 255) {
      throw new Error('B is not a valid number or out of range (0-255)!');
    }
    this.b = b;
  }
  
  public toHexString(): string {
    return (
      '#' +
      this.R.toString(16).padStart(2, '0') +
      this.G.toString(16).padStart(2, '0') +
      this.B.toString(16).padStart(2, '0')
    ).toLowerCase();
  }
  
  public toRGBString(alpha: number): string {

    if (isNaN(alpha) || alpha < 0 || alpha > 1) {
      throw new Error('Alpha is not a valid number or out of range (0-1)!');
    }
    return `rgb(${this.R}, ${this.G}, ${this.B}, ${alpha})`;
  }
}
