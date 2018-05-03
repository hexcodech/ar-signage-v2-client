import {Component, OnInit} from '@angular/core';
import {ElectronService} from 'ngx-electron';
import {UuidService} from './services/uuid.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(
    private electronService: ElectronService,
    public uuidService: UuidService,
  ) {}

  ngOnInit() {
    console.log(`Client ${this.uuidService.uuid} starting...`);
  }


}
