import {Injectable} from '@angular/core';
import {ElectronService} from 'ngx-electron';

@Injectable()
export class UuidService {
  public uuid = 'undefined';

  private uuidModule: any;

  constructor(private electronService: ElectronService) {
    if (this.electronService.isElectronApp) {
      this.fetchUUID();
    }
  }

  private fetchUUID() {
    this.uuidModule = new (this.electronService.remote.require('./modules/uuid.js'))();
    this.uuid = this.uuidModule.getUUID();
  }

}
