import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// compornent
import { TopComponent } from './top/top.component';
import { CameraAndMicrophoneComponent } from './camera-and-microphone/camera-and-microphone.component';
import { GeolocationComponent } from './geolocation/geolocation.component';
import { DevicePositionComponent } from './device-position/device-position.component';
import { BluetoothComponent } from './bluetooth/bluetooth.component';
import { UsbComponent } from './usb/usb.component';
import { AudioVisualizationComponent } from './audio-visualization/audio-visualization.component';
import { FileComponent } from './file/file.component';
import { FormAndValidationComponent } from './form-and-validation/form-and-validation.component';
import { CalendarComponent } from './calendar/calendar.component';

const routes: Routes = [
  {
    path: 'top',
    component: TopComponent,
  },
  {
    path: 'camera-microphone',
    component: CameraAndMicrophoneComponent,
  },
  {
    path: 'audio-visualization',
    component: AudioVisualizationComponent,
  },
  {
    path: 'geolocation',
    component: GeolocationComponent,
  },
  {
    path: 'deviceposition',
    component: DevicePositionComponent,
  },
  {
    path: 'bluetooth',
    component: BluetoothComponent,
  },
  {
    path: 'usb',
    component: UsbComponent,
  },
  {
    path: 'file',
    component: FileComponent,
  },
  {
    path: 'form-validation',
    component: FormAndValidationComponent,
  },
  {
    path: 'calendar',
    component: CalendarComponent,
  },
  {
    path: '**',
    redirectTo: 'top',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
