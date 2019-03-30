import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeolocationService {
  positionOptions: PositionOptions = {
    enableHighAccuracy: true,
    maximumAge: 0, // Not use a cached position
    timeout: 100000 // ms
  };

  constructor() { }

  // https://github.com/angular/angular/issues/27597
  createWatchPosition(): Observable<Position> {
    return new Observable((observer) => {
      let watchId;

      const onSuccess: PositionCallback = (pos: Position) => {
        observer.next(pos);
      };

      const onError: PositionErrorCallback | any = (error) => {
        observer.error(error);
      };

      if ('geolocation' in navigator) {
        watchId = navigator.geolocation.watchPosition(onSuccess, onError, this.positionOptions);
      } else {
        onError('Geolocation not available');
      }

      return { unsubscribe() { navigator.geolocation.clearWatch(watchId); } };
    });
  }

}
