import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlipClockDigitComponent } from './flip-clock-digit.component';

describe('FlipClockDigitComponent', () => {
  let component: FlipClockDigitComponent;
  let fixture: ComponentFixture<FlipClockDigitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlipClockDigitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlipClockDigitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
