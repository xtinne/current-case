import { Injectable } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';

import type { Position } from './station.model';

export const OSLO_CENTRE: Position = { lat: 59.9139, lng: 10.7522 };
const LOCATION_TIMEOUT_MS = 10_000;

export interface UserLocation {
  position: Position;
  // True when the real location is unavailable (denied, unsupported or timed out).
  isFallback: boolean;
}

@Injectable({ providedIn: 'root' })
export class LocationService {
  async getLocation(): Promise<UserLocation> {
    try {
      const { coords } = await Geolocation.getCurrentPosition({ timeout: LOCATION_TIMEOUT_MS });
      return { position: { lat: coords.latitude, lng: coords.longitude }, isFallback: false };
    } catch {
      return { position: OSLO_CENTRE, isFallback: true };
    }
  }
}
