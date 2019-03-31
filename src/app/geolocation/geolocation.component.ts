import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { GeolocationService } from '../services/geolocation.service';
import { Observable } from 'rxjs';

import * as L from 'leaflet';

export interface GeoLocations {
  lat: number;
  lon: number;
  timestamp: number;
}

@Component({
  selector: 'app-geolocation',
  templateUrl: './geolocation.component.html',
  styleUrls: ['./geolocation.component.scss']
})
export class GeolocationComponent implements OnInit, AfterViewInit {
  loading = false;
  start = false;
  initDone = false;
  geoLocation: GeoLocations = {lat: 0, lon: 0, timestamp: 0};
  locationsSubscription: any;

  map: any;
  @ViewChild('map') mapElm: ElementRef<any>;

  constructor(
    private geolocationService: GeolocationService,
  ) { }

  ngOnInit() {
    this.subscribeGeolocation();
  }

  ngAfterViewInit() {
    // Stop listening for location after 10 seconds
    setTimeout(() => { this.locationsSubscription.unsubscribe(); }, 10000);
  }

  subscribeGeolocation() {
    this.loading = true;
    this.locationsSubscription = this.geolocationService.createWatchPosition().subscribe(
      (value: Position) => {
        // console.log('geolocationService value', value);
        this.geoLocation.lat = value.coords.latitude;
        this.geoLocation.lon = value.coords.longitude;
        this.geoLocation.timestamp = value.timestamp;

        this.loading = false;
        console.log('loading done!');
      },
      error => {
        console.log('error:', error);
        this.loading = false;
      }
    );
    if (this.map) {
      // this.map.panTo([43.062638, 141.353921]);
      this.start = true;
    }
  }

  unsubscribeGeolocation() {
    this.locationsSubscription.unsubscribe();
    this.start = false;
  }

  setMap() {
    // 43.062638, 141.353921 is my hometown Sapporo! Best place in the earth! :)
    this.map = L.map('map').setView([this.geoLocation.lat, this.geoLocation.lon], 14);

    const now = new Date(this.geoLocation.timestamp);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    L.marker(
      [this.geoLocation.lat, this.geoLocation.lon]
    ).bindPopup(
      '<b>Hello!!</b><br>Today is ' + (now.getMonth() + 1) + '/' + now.getDate()
    ).addTo(this.map);

    // L.circle(
    //   [this.geoLocation.lat, this.geoLocation.lon],
    //   { color: 'red', fillColor: '#f03', fillOpacity: 0.5, radius: 500}
    // ).addTo(this.map);

    // L.polyline([
    //   [34.702495, 135.495961],
    //   [34.712525, 135.505991],
    //   [34.712545, 135.504991],
    // ], {
    //   'color': '#FF0000',
    //   'weight': 5,
    //   'opacity': 0.6
    // }).addTo(this.map);

    this.map.on('locationfound', this.setMap);
    this.map.locate({setView: true, watch: true, maxZoom: 14});

    this.start = true;
    this.initDone = true;
  }


}
