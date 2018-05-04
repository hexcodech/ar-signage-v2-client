import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {NgxElectronModule} from 'ngx-electron';

import {AppComponent} from './app.component';
import {UuidService} from './services/uuid.service';
import {MqttService} from './services/mqtt.service';
import {HeaderComponent} from './header/header.component';
import {FlipClockComponent} from './flip-clock/flip-clock.component';
import {FlipClockDigitComponent} from './flip-clock/flip-clock-digit/flip-clock-digit.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FlipClockComponent,
    FlipClockDigitComponent
  ],
  imports: [
    BrowserModule,
    NgxElectronModule,
  ],
  providers: [
    UuidService,
    MqttService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
