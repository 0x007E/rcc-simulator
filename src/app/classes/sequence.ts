import { SequenceMode } from "../enums/sequence";

export class Sequence {

  private mode!: SequenceMode;
  private blocked!: boolean;
  private variable!: boolean;
  private delay!: number;
  private interval!: number;
  private color!: string[];

  public get Mode(): SequenceMode {
    return this.mode;
  }
  public set Mode(mode: SequenceMode) {
    if (!(mode in SequenceMode)) {
      throw new Error('Mode is not valid!');
    }
    this.mode = mode;
  }

  public get Variable(): boolean {
    return this.variable;
  }
  public set Variable(variable: boolean) {
    this.variable = variable;
  }

  public get Blocked(): boolean {
    return this.blocked;
  }
  public set Blocked(blocked: boolean) {
    this.blocked = blocked;
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

  public get Delay(): number {
    return this.delay;
  }
  public set Delay(delay: number) {
    if(delay < 1) {
      throw new Error('Delay is not valid!');
    }
    this.delay = delay;
  }

  public get Interval(): number {
    return this.interval;
  }
  public set Interval(interval: number) {
    if(interval < 1) {
      throw new Error('Delay is not valid!');
    }
    this.interval = interval;
  }
}