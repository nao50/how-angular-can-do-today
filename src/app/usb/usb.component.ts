import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-usb',
  templateUrl: './usb.component.html',
  styleUrls: ['./usb.component.scss']
})
export class UsbComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  getAllDevices() {
    (navigator as any).usb.requestDevice({'filters': []})
    .then(device => {
        console.log(device);
      })
      .catch(error => { console.log(error); });
  }
}
