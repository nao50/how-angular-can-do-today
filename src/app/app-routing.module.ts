import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// compornent
import { TopComponent } from './top/top.component';
import { CameraAndMicrophoneComponent } from './camera-and-microphone/camera-and-microphone.component';
import { GeolocationComponent } from './geolocation/geolocation.component';
import { DevicePositionComponent } from './device-position/device-position.component';

const routes: Routes = [
  {
    path: 'top',
    component: TopComponent,
  },
  {
    path: 'camera-and-microphone',
    component: CameraAndMicrophoneComponent,
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
    path: '**',
    redirectTo: 'top',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
