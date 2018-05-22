import {Component, OnInit, OnDestroy} from '@angular/core';
import {ElectronService} from 'ngx-electron';
import {UuidService} from './services/uuid.service';
import {MqttService} from './services/mqtt.service';
import {MediaCacheService} from './services/media-cache.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  public headerVisible = true;
  public mediaType = 'none';
  public timerSeconds = 0;
  public mediaText = '';
  public mediaUrl = '';
  private roomName: string;

  constructor(
    private electronService: ElectronService,
    private uuidService: UuidService,
    private mqttService: MqttService,
    private mediaCacheService: MediaCacheService,
  ) {}

  ngOnInit() {
    console.log(`Client ${this.uuidService.uuid} starting...`);

    this.mqttService.connect()
    .then((ip) => {
      console.log(`Client connected to mqtt ${ip}`);
      this.mqttService.mqttModule.mqttClient.on('message', (topic, message) => this.mqttMessageHandler(topic, message)); // Register message handler
      this.mqttService.mqttModule.mqttClient.subscribe(`ar-signage/client/${this.uuidService.uuid}/roomname`); // Subscribe to private client topic
      this.mqttService.mqttModule.mqttClient.publish('ar-signage/devicediscovery', JSON.stringify({ // Publish uuid to devicediscovery topic
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
    this.mqttService.mqttModule.mqttClient.end();
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
        // Unsubscribe if there is already a roomName set
        if (this.roomName) {
          this.mqttService.mqttModule.mqttClient.unsubscribe(`ar-signage/${this.roomName}/timer/seconds`);
          this.mqttService.mqttModule.mqttClient.unsubscribe(`ar-signage/${this.roomName}/${this.uuidService.uuid}/#`);
        }

        // Set roomName and subscribe to all important topics
        this.roomName = messageObject.value;
        this.mqttService.mqttModule.mqttClient.subscribe(`ar-signage/${this.roomName}/timer/seconds`);
        this.mqttService.mqttModule.mqttClient.subscribe(`ar-signage/${this.roomName}/${this.uuidService.uuid}/#`);
        break;
      case `ar-signage/client/${this.uuidService.uuid}/mediacacheurl`:
        this.mediaCacheService.init(messageObject.value);
        break;
      case `ar-signage/${this.roomName}/timer/seconds`:
        this.timerSeconds = messageObject.value;
        break;
      case `ar-signage/${this.roomName}/${this.uuidService.uuid}/media/none`:
        this.mediaType = 'none';
        break;
      case `ar-signage/${this.roomName}/${this.uuidService.uuid}/media/text`:
        this.mediaType = 'text';
        this.mediaText = messageObject.value;
        break;
      case `ar-signage/${this.roomName}/${this.uuidService.uuid}/media/image`:
        this.mediaCacheService.mediaCacheModule.getLink(messageObject.value).then((url) => {
          this.mediaType = 'image';
          this.mediaUrl = url;
        }).catch((err) => console.error(err));
        break;
      case `ar-signage/${this.roomName}/${this.uuidService.uuid}/media/video`:
        this.mediaCacheService.mediaCacheModule.getLink(messageObject.value).then((url) => {
          this.mediaType = 'video';
          this.mediaUrl = url;
        }).catch((err) => console.error(err));
        break;
    }
  }

  videoOnEnded() {
    // Check if mqttModule is successfully created and therefore possesses the publish function
    if (this.mqttService.mqttModule.mqttClient.publish) {
      this.mqttService.mqttModule.mqttClient.publish(`ar-signage/${this.roomName}/${this.uuidService.uuid}/media/video/remaining`, JSON.stringify({
        value: 0
      }));
    }
    this.mediaType = 'none';
    this.mediaUrl = '';
  }

  videoUpdateRemaining() {
    // TODO: Announce videoTimeRemaining, throttle it!
  }
}
