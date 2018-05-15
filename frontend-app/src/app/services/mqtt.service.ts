import {Injectable} from '@angular/core';
import {ElectronService} from 'ngx-electron';

@Injectable()
export class MqttService {

  private mqttModule: any;

  constructor(private electronService: ElectronService) {
    if (this.electronService.isElectronApp) {
      this.connect();
    }
  }

  private connect() {
    this.mqttModule = new (this.electronService.remote.require('./modules/mqtt.js'))();
    this.mqttModule.connect()
    .then((data) => {
      console.dir(data);
    })
    .catch((err) => {
      console.error(err);
    });
  }

}
