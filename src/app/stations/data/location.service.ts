import { Injectable } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';

import type { Position } from './station.model';

export const OSLO_CENTRE: Position = { lat: 59.9139, lng: 10.7522 };

export interface UserLocation {
  position: Position;
  // True when the real location is unavailable (denied, unsupported or timed out).
  isFallback: boolean;
}

@Injectable({ providedIn: 'root' })
export class LocationService {
  async getLocation(): Promise<UserLocation> {
    try {
      const { coords } = await Geolocation.getCurrentPosition();
      return { position: { lat: coords.latitude, lng: coords.longitude }, isFallback: false };
    } catch {
      return { position: OSLO_CENTRE, isFallback: true };
    }
  }
}
