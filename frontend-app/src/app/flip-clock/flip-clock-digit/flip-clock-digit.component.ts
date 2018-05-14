import { Component, OnInit, Input } from '@angular/core';
import { trigger, style, transition, animate, keyframes, query, stagger } from '@angular/animations';

@Component({
  selector: 'app-flip-clock-digit',
  templateUrl: './flip-clock-digit.component.html',
  styleUrls: ['./flip-clock-digit.component.scss'],
  animations: [
    trigger('flipTop', [
      transition('* => *', [
        query('.current-top', animate('.5s linear', keyframes([
          style({transform: 'rotateX(0deg)'}),
          style({transform: 'rotateX(90deg)'}),
          style({transform: 'rotateX(90deg)'}),
        ])), {optional: true})
      ])
    ]),
    trigger('flipBottom', [
      transition('* => *', [
        query('.next-bottom', animate('.5s linear', keyframes([
          style({transform: 'rotateX(90deg)'}),
          style({transform: 'rotateX(90deg)'}),
          style({transform: 'rotateX(0deg)'}),
        ])), {optional: true})
      ])
    ]),
  ],
})
export class FlipClockDigitComponent implements OnInit {
  @Input() value: number;

  constructor() { }

  ngOnInit() {
  }

}
