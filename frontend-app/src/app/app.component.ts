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
      this.mqttService.mqttModule.on('message', (topic, message) => this.mqttMessageHandler(topic, message)); // Register message handler
      this.mqttService.mqttModule.subscribe(`ar-signage/client/${this.uuidService.uuid}/roomname`); // Subscribe to private client topic
      this.mqttService.mqttModule.publish('ar-signage/devicediscovery', JSON.stringify({ // Publish uuid to devicediscovery topic
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
    let messageObject;
    try {
      messageObject = JSON.parse(message.toString());
    } catch (err) {
      console.error(`mqttMessageHandler JSON parse error: ${err.toString()}`);
      return;
    }

    switch (topic) {
      case `ar-signage/client/${this.uuidService.uuid}/roomname`:
        this.mqttService.mqttModule.subscribe(`ar-signage/${messageObject.value}/${this.uuidService.uuid}`);
        break;
    }
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
