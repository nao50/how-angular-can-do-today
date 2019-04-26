import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { GeolocationService } from '../services/geolocation.service';

import { debounceTime } from 'rxjs/operators';

import { MatTableDataSource } from '@angular/material';

import * as L from 'leaflet';

export interface GeoLocations {
  lat: number;
  lon: number;
  timestamp: number;
}

export interface GeoTable {
  index: number;
  time: Date;
  lat: number;
  lon: number;
}

@Component({
  selector: 'app-geolocation',
  templateUrl: './geolocation.component.html',
  styleUrls: ['./geolocation.component.scss']
})
export class GeolocationComponent implements OnInit, AfterViewInit, OnDestroy {
  loading = false;
  start = false;
  initDone = false;
  geoLocation: GeoLocations;
  geoLocationArray: GeoLocations[] = [];
  locationsSubscription: any;

  // datatable
  geotable: GeoTable[] = [];
  displayedColumns: string[] = ['index', 'time', 'lat', 'lon'];
  columnsToDisplay: string[] = this.displayedColumns.slice();
  data = new MatTableDataSource(this.geotable);
  i = 1;


  map: any;
  @ViewChild('map') mapElm: ElementRef<any>;

  constructor(
    private geolocationService: GeolocationService,
  ) { }

  ngOnInit() {
    this.subscribeGeolocation();
  }

  ngAfterViewInit() {
    this.initMap();
    // Stop listening for location after 10 seconds
    // setTimeout(() => { this.locationsSubscription.unsubscribe(); }, 10000);
  }

  ngOnDestroy() {
    if (this.locationsSubscription) {
      this.locationsSubscription.unsubscribe();
    }
  }

  subscribeGeolocation() {
    this.loading = true;
    this.locationsSubscription = this.geolocationService.createWatchPosition()
    .pipe(
      debounceTime(1000)
    )
    .subscribe(
      (value: Position) => {
        this.geoLocation = {} as GeoLocations;
        this.geoLocation.lat = value.coords.latitude;
        this.geoLocation.lon = value.coords.longitude;
        this.geoLocation.timestamp = value.timestamp;

        // Add Table
        if (this.geotable.length < 10) {
          this.geotable.push(
            {index: this.i, time: new Date(value.timestamp), lat: value.coords.latitude, lon: value.coords.longitude}
          );
        } else {
          this.geotable.shift();
          this.geotable.push(
            {index: this.i, time: new Date(value.timestamp), lat: value.coords.latitude, lon: value.coords.longitude}
          );
        }
        this.data = new MatTableDataSource(this.geotable);
        this.i++;

        // Add Map
        if (this.geoLocationArray.length < 10) {
          this.geoLocationArray.push(this.geoLocation);
        } else {
          this.geoLocationArray.shift();
          this.geoLocationArray.push(this.geoLocation);
        }
        // console.log('this.geoLocationArray: ', this.geoLocationArray);

        this.loading = false;

        if (this.map) {
          this.setMaker();
        }
      },
      error => {
        console.log('error:', error);
        this.loading = false;
      }
    );

    if (this.map) {
      this.start = true;
      this.loading = false;
    }

  }

  unsubscribeGeolocation() {
    this.locationsSubscription.unsubscribe();
    this.start = false;
  }

  initMap() {
    // 43.062638, 141.353921 is my hometown Sapporo! Best place in the earth! :)
    // this.map = L.map('map').setView([this.geoLocation.lat, this.geoLocation.lon], 14);
    this.map = L.map('map').setView([43.062638, 141.353921], 14);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    this.start = true;
    this.initDone = true;
  }


  setMaker() {
    const polylineArray = [];

    if (this.geoLocationArray) {
      for (let i = 0; this.geoLocationArray.length > i; i++ ) {
        const now = new Date(this.geoLocationArray[i].timestamp);

        // Add marker
        L.marker(
          [this.geoLocationArray[i].lat, this.geoLocationArray[i].lon]
        ).bindPopup(
          '<b>Hello!!</b><br>Today is ' + (now.getMonth() + 1) + '/' + now.getDate()
        ).addTo(this.map);

        this.map.flyTo([this.geoLocationArray[i].lat, this.geoLocationArray[i].lon], 14, { duration: 2 });

        // polylineArray
        polylineArray.push( [this.geoLocationArray[i].lat, this.geoLocationArray[i].lon]);

        // Add line
        L.polyline([polylineArray], {
          'color': '#FF0000',
          'weight': 5,
          'opacity': 0.6
        }).addTo(this.map);

      }
    }

    this.start = true;
    // this.initDone = true;
  }


}
