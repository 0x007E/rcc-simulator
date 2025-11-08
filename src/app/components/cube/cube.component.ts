import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Color } from '../../classes/color';
import { Cube } from '../../classes/cube';

@Component({
  selector: 'app-cube',
  imports: [CommonModule],
  templateUrl: './cube.component.html',
  styleUrl: './cube.component.css',
})
export class CubeComponent {

  public readonly BACKGROUND_ALPHA = 0.25;
  public readonly FOREGROUND_ALPHA = 0.75;

  @Input() cube!: Cube;

  @Output() onClickEvent = new EventEmitter<void>();
  @Output() onMouseDownEvent = new EventEmitter<void>();
  @Output() onMouseUpEvent = new EventEmitter<void>();
  @Output() onMouseLeaveEvent = new EventEmitter<void>();

  public onClick() {
    this.onClickEvent.emit();
  }

  public onMouseDown() {
    this.onMouseDownEvent.emit();
  }

  public onMouseUp() {
    this.onMouseUpEvent.emit();
  }

  public onMouseLeave() {
    this.onMouseLeaveEvent.emit();
  }

  public shadowBoxStyle(color: Color): string {
    return `0 0 40px 20px rgba(${color.R}, ${color.G}, ${color.B}, ${this.FOREGROUND_ALPHA})`;
  }
}
