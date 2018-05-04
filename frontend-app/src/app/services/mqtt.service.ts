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
    this.mqttModule = new (this.electronService.remote.require('./modules/mqtt.js'))('mqtt://192.168.178.2');
  }

}
