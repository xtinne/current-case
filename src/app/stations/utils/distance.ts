import { latLng } from 'leaflet';

import type { Position, Station } from '@/app/stations/data/station.model';

export interface StationWithDistance {
  station: Station;
  distanceKm: number;
}

// Straight-line distance ("as the crow flies"), calculated by Leaflet.
export function sortByDistance(stations: Station[], from: Position): StationWithDistance[] {
  const origin = latLng(from.lat, from.lng);

  return stations
    .map((station) => ({
      station,
      distanceKm: origin.distanceTo(latLng(station.position.lat, station.position.lng)) / 1000,
    }))
    .sort((a, b) => a.distanceKm - b.distanceKm);
}

// 0.85 -> "850 m", 2.34 -> "2.3 km"
export function formatDistance(km: number): string {
  return km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(1)} km`;
}
