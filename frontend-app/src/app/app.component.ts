import {Component, OnInit, OnDestroy} from '@angular/core';
import {ElectronService} from 'ngx-electron';
import {UuidService} from './services/uuid.service';
import {MqttService} from './services/mqtt.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  public headerVisible = true;
  public mediaType = 'video';
  public timerSeconds = 0;
  public mediaText = '';
  public mediaUrl = 'https://www.w3schools.com/html/mov_bbb.mp4';

  constructor(
    private electronService: ElectronService,
    private uuidService: UuidService,
    private mqttService: MqttService,
  ) {}

  ngOnInit() {
    console.log(`Client ${this.uuidService.uuid} starting...`);

    this.mqttService.connect()
    .then((ip) => {
      console.log(`Client connected to mqtt ${ip}`);
      this.mqttService.mqttModule.on('message', (topic, message) => this.mqttMessageHandler(topic, message));
      this.mqttService.mqttModule.subscribe(``); // TODO: How are the personal topics named?
      this.mqttService.mqttModule.publish('/ar-signage/devicediscovery', JSON.stringify({
        value: {
          uuid: this.uuidService.uuid,
          role: 'client',
        }
      }));
    })
    .catch((err) => {
      console.error(err);
    });
  }

  ngOnDestroy() {
    this.mqttService.mqttModule.end();
  }

  mqttMessageHandler(topic, message) {
    console.log(`MQTT Message on topic ${topic}: ${message.toString()}`);
  }

  videoOnEnded() {
    // TODO: Announce videoTimeRemaining 0
    this.mediaType = 'none';
    this.mediaUrl = '';
  }

  videoUpdateRemaining() {
    // TODO: Announce videoTimeRemaining
  }
}
