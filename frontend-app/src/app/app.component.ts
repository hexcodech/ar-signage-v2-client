import {Component, OnInit} from '@angular/core';
import {ElectronService} from 'ngx-electron';
import {UuidService} from './services/uuid.service';
import {MqttService} from './services/mqtt.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public headerVisible = true;
  public mediaType: string = 'text';

  constructor(
    private electronService: ElectronService,
    private uuidService: UuidService,
    private mqttService: MqttService,
  ) {}

  ngOnInit() {
    console.log(`Client ${this.uuidService.uuid} starting...`);
    // TODO: Subscribe to mqtt topic named after uuid, apply topic messages to state variables
    // TODO: Announce client in client_discovery topic
  }


}
