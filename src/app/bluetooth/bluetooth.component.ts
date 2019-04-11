import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-bluetooth',
  templateUrl: './bluetooth.component.html',
  styleUrls: ['./bluetooth.component.scss']
})
export class BluetoothComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  // getAllDevices() {
  //   const devices = (navigator as any).bluetooth
  //     .requestDevice(
  //       {acceptAllDevices: true},
  //     ).catch(
  //       error => {
  //         console.error(error);
  //       }
  //     );
  //   console.log(devices);
  // }
  async getAllDevices() {
    const device1 = await (navigator as any).bluetooth
      .requestDevice(
        {acceptAllDevices: true},
      ).then(device => {
        device.gatt.device.gatt.connect();
        console.log('device:', device);
        device.gatt.connect();
      }).then(server => {
        console.log('Getting Heart Rate Service...');
        server.getPrimaryService('heart_rate');
      }).then(service => {
        console.log('Getting Heart Rate Control Point Characteristic...');
        service.getCharacteristic('body_sensor_location');
      })
      .catch(
        error => {
          console.error(error);
        }
      );

    console.log('AAA: ', device1);

  }

  getDevicesBattery() {
    (navigator as any).bluetooth.requestDevice({ filters: [{ services: ['battery_service'] }] })
      .then(device => { console.log(device); })
      .catch(error => { console.log(error); });
  }

}
