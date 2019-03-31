import { Component, OnInit, HostListener } from '@angular/core';

@Component({
  selector: 'app-device-position',
  templateUrl: './device-position.component.html',
  styleUrls: ['./device-position.component.scss']
})
export class DevicePositionComponent implements OnInit {
  // DeviceOrientationEvent
  orientationTimeStamp = 0;
  orientationAbsolute: boolean;
  orientationX = 0;
  orientationY = 0;
  orientationZ = 0;

  // DeviceMotionEvent
  motionTimeStamp = 0;
  accelerationX = 0;
  accelerationY = 0;
  accelerationZ = 0;
  accelerationIncludingGravityX = 0;
  accelerationIncludingGravityY = 0;
  accelerationIncludingGravityZ = 0;
  rotationRateAlpha = 0;
  rotationRateBeta = 0;
  rotationRateGamma = 0;
  rotationInterval = 0;

  constructor() { }

  ngOnInit() {
  }

  @HostListener('window:deviceorientation', ['$event'])
  updateOrientationInfo(event: DeviceOrientationEvent) {
    this.orientationTimeStamp = Math.ceil(event.timeStamp);
    this.orientationAbsolute = event.absolute;
    this.orientationZ = Math.ceil(event.alpha);
    this.orientationX = Math.ceil(event.beta);
    this.orientationY = Math.ceil(event.gamma);
  }

  @HostListener('window:devicemotion', ['$event'])
  updateDevicemotionInfo(event: DeviceMotionEvent) {
    this.motionTimeStamp = Math.ceil(event.timeStamp);
    this.accelerationX = Math.ceil(event.acceleration.x);
    this.accelerationY = Math.ceil(event.acceleration.y);
    this.accelerationZ = Math.ceil(event.acceleration.z);
    this.accelerationIncludingGravityX = Math.ceil(event.accelerationIncludingGravity.x);
    this.accelerationIncludingGravityY = Math.ceil(event.accelerationIncludingGravity.y);
    this.accelerationIncludingGravityZ = Math.ceil(event.accelerationIncludingGravity.z);
    this.rotationRateAlpha = Math.ceil(event.rotationRate.alpha);
    this.rotationRateBeta = Math.ceil(event.rotationRate.beta);
    this.rotationRateGamma = Math.ceil(event.rotationRate.gamma);
    this.rotationInterval = Math.ceil(event.interval);
  }


}
