import {Injectable} from '@angular/core';
import {ElectronService} from 'ngx-electron';

@Injectable()
export class MqttService {

  private mqttModule: any;

  constructor(private electronService: ElectronService) {}

  public connect() {
    this.mqttModule = new (this.electronService.remote.require('./modules/mqtt.js'))();
    return this.mqttModule.connect();
  }

}
