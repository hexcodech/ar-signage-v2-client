import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {NgxElectronModule} from 'ngx-electron';

import {AppComponent} from './app.component';
import { UuidService } from './services/uuid.service';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    NgxElectronModule,
  ],
  providers: [
    UuidService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
