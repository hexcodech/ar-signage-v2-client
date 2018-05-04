import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-flip-clock',
  templateUrl: './flip-clock.component.html',
  styleUrls: ['./flip-clock.component.scss']
})
export class FlipClockComponent implements OnInit {
  public _timerSeconds: number;
  public minuteString: string;
  public secondString: string;
  public m1: number;
  public m2: number;
  public s1: number;
  public s2: number;

  @Input() set timerSeconds(timerSeconds: number) {
    this._timerSeconds = timerSeconds;
    this.minuteString = ('0' + Math.floor(this._timerSeconds / 60)).slice(-2);
    this.secondString = ('0' + this._timerSeconds % 60).slice(-2);
    this.m1 = parseInt(this.minuteString.substr(0, 1), 10);
    this.m2 = parseInt(this.minuteString.substr(1, 2), 10);
    this.s1 = parseInt(this.secondString.substr(0, 1), 10);
    this.s2 = parseInt(this.secondString.substr(1, 2), 10);
  }

  constructor() { }

  ngOnInit() {
  }

}
