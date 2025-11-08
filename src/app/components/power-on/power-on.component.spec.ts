import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PowerOnComponent } from './power-on.component';

describe('PowerOnComponent', () => {
  let component: PowerOnComponent;
  let fixture: ComponentFixture<PowerOnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PowerOnComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PowerOnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
