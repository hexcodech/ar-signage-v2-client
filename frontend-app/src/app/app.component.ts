import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
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
  public mediaType = 'video';
  public timerSeconds = 0;
  public mediaText = '';
  public mediaUrl = 'http://techslides.com/demos/sample-videos/small.mp4';
  public mediaTimeThrottler = this.throttle(this.videoUpdateRemaining, 1000, {});
  public backgroundAudioUrl = '';
  public backgroundAudioVolume = 1.0;
  public oneshotAudioUrl = '';
  private roomName: string;

  @ViewChild('video') videoElement;
  @ViewChild('backgroundAudio') backgroundAudioElement;
  @ViewChild('oneshotAudio') oneshotAudioElement;

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
      this.mqttService.mqttModule.mqttClient.subscribe(`ar-signage/client/${this.uuidService.uuid}/mediacacheurl`); // Subscribe to private media cache url topic
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
        this.mediaUrl = '';
        break;
      case `ar-signage/${this.roomName}/${this.uuidService.uuid}/media/text`:
        this.mediaType = 'text';
        this.mediaUrl = '';
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
      case `ar-signage/${this.roomName}/${this.uuidService.uuid}/media/video/control`:
        switch (messageObject.value) {
          case `RESET`:
            this.videoElement.nativeElement.pause();
            this.videoElement.nativeElement.currentTime = 0;
            this.videoElement.nativeElement.play();
            break;
          case `PAUSE`:
            this.videoElement.nativeElement.pause();
            break;
          case `START`:
            this.videoElement.nativeElement.play();
            break;
        }
        break;

      case `ar-signage/${this.roomName}/${this.uuidService.uuid}/audio/background`:
        this.mediaCacheService.mediaCacheModule.getLink(messageObject.value).then((url) => {
          this.backgroundAudioUrl = url;
        }).catch((err) => console.error(err));
        break;
      case `ar-signage/${this.roomName}/${this.uuidService.uuid}/audio/background/control`:
        switch (messageObject.value) {
          case `RESET`:
            this.backgroundAudioElement.nativeElement.pause();
            this.backgroundAudioElement.nativeElement.currentTime = 0;
            this.backgroundAudioElement.nativeElement.play();
            break;
          case `PAUSE`:
            this.backgroundAudioElement.nativeElement.pause();
            break;
          case `START`:
            this.backgroundAudioElement.nativeElement.play();
            break;
        }
        break;
      case `ar-signage/${this.roomName}/${this.uuidService.uuid}/audio/background/volume`:
        this.backgroundAudioVolume = messageObject.value;
        break;
      case `ar-signage/${this.roomName}/${this.uuidService.uuid}/audio/oneshot`:
        this.mediaCacheService.mediaCacheModule.getLink(messageObject.value).then((url) => {
          this.oneshotAudioUrl = url;
        }).catch((err) => console.error(err));
        break;
    }
  }

  videoOnEnded() {
    // Check if mqttModule is successfully created and therefore possesses the publish function
    if (this.mqttService.mqttModule.mqttClient) {
      this.mqttService.mqttModule.mqttClient.publish(`ar-signage/${this.roomName}/${this.uuidService.uuid}/media/video/currenttime`, JSON.stringify({
        value: 0
      }), {retain: true});
      this.mqttService.mqttModule.mqttClient.publish(`ar-signage/${this.roomName}/${this.uuidService.uuid}/media/none`, JSON.stringify({
        value: null
      }), {retain: true});
    }
    this.mediaType = 'none';
    this.mediaUrl = '';
  }

  videoUpdateRemaining() {
    if (this.mqttService.mqttModule.mqttClient && this.videoElement) {
      this.mqttService.mqttModule.mqttClient.publish(`ar-signage/${this.roomName}/${this.uuidService.uuid}/media/video/currenttime`, JSON.stringify({
        value: this.videoElement.nativeElement.currentTime
      }), {retain: true});
    }
  }

  private throttle(func, wait, options) {
    let context, args, result;
    let timeout = null;
    let previous = 0;
    if (!options) {
      options = {};
    }
    const later = function() {
      previous = options.leading === false ? 0 : Date.now();
      timeout = null;
      result = func.apply(context, args);
      if (!timeout) {
        context = args = null;
      }
    };
    return function() {
      const now = Date.now();
      if (!previous && options.leading === false) {
        previous = now;
      }
      const remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0 || remaining > wait) {
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
        previous = now;
        result = func.apply(context, args);
        if (!timeout) {
          context = args = null;
        }
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
  }
}
