import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-flip-clock-digit',
  templateUrl: './flip-clock-digit.component.html',
  styleUrls: ['./flip-clock-digit.component.scss']
})
export class FlipClockDigitComponent implements OnInit {
  @Input() value: number;

  constructor() { }

  ngOnInit() {
  }

}
