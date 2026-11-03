import type { Station } from '@/app/stations/data/station.model';

import { getAvailability } from './availability';

export interface StationFilters {
  availableNow: boolean;
  connectorTypes: string[];
  minPowerKw: number;
  hidePrivate: boolean;
}

export const NO_FILTERS: StationFilters = {
  availableNow: false,
  connectorTypes: [],
  minPowerKw: 0,
  hidePrivate: false,
};

export const FAST_CHARGING_MIN_KW = 50;

export const POWER_OPTIONS = [
  { label: 'Any', unit: 'all', minPowerKw: 0 },
  { label: '22+', unit: 'kW', minPowerKw: 22 },
  { label: '50+', unit: 'kW', minPowerKw: FAST_CHARGING_MIN_KW },
  { label: '150+', unit: 'kW', minPowerKw: 150 },
];

export const PLUG_DESCRIPTIONS: Record<string, string> = {
  CCS2: 'DC fast',
  CHAdeMO: 'DC fast',
  'Type 2': 'AC',
};

export function filterStations(stations: Station[], filters: StationFilters): Station[] {
  return stations.filter(
    (station) =>
      (!filters.availableNow || getAvailability(station) === 'available') &&
      (filters.connectorTypes.length === 0 ||
        station.connectors.some((connector) => filters.connectorTypes.includes(connector.type))) &&
      station.maxPowerKw >= filters.minPowerKw &&
      (!filters.hidePrivate || station.access === 'public'),
  );
}

export function countActiveFilters(filters: StationFilters): number {
  return [filters.availableNow, filters.connectorTypes.length > 0, filters.minPowerKw > 0, filters.hidePrivate].filter(
    Boolean,
  ).length;
}

export function getConnectorTypes(stations: Station[]): string[] {
  return [...new Set(stations.flatMap((station) => station.connectors.map((connector) => connector.type)))].sort();
}

// Searches station names only; searching addresses or places would need a geocoding API.
export function searchStations(stations: Station[], query: string): Station[] {
  const normalizedQuery = query.trim().toLocaleLowerCase();
  return normalizedQuery
    ? stations.filter((station) => station.name.toLocaleLowerCase().includes(normalizedQuery))
    : stations;
}
