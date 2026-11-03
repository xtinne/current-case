import type { Station } from '@/app/stations/data/station.model';

import { formatDistance, sortByDistance } from './distance';

const oslo = { lat: 59.9139, lng: 10.7522 };
const bergen = { lat: 60.3913, lng: 5.3221 };
const trondheim = { lat: 63.4305, lng: 10.3951 };

function stationAt(id: number, position: Station['position']): Station {
  return {
    id,
    name: `Station ${id}`,
    address: 'Testgata 1',
    town: 'Oslo',
    position,
    maxPowerKw: 22,
    isOpen: true,
    access: 'public',
    chargers: { total: 1, available: 1, occupied: 0, offline: 0 },
    connectors: [],
  };
}

describe('sortByDistance', () => {
  it('sorts stations from nearest to farthest', () => {
    const stations = [stationAt(1, trondheim), stationAt(2, oslo), stationAt(3, bergen)];

    const sorted = sortByDistance(stations, oslo);

    expect(sorted.map((item) => item.station.id)).toEqual([2, 3, 1]);
  });

  it('gives distances in kilometres (Oslo to Bergen is about 305 km)', () => {
    const [here, bergenStation] = sortByDistance([stationAt(1, oslo), stationAt(2, bergen)], oslo);

    expect(here.distanceKm).toBe(0);
    expect(bergenStation.distanceKm).toBeCloseTo(305, -1);
  });
});

describe('formatDistance', () => {
  it.each([
    [0.85, '850 m'],
    [0.004, '4 m'],
    [1, '1.0 km'],
    [2.34, '2.3 km'],
    [305.42, '305.4 km'],
  ])('formats %s km as "%s"', (km, expected) => {
    expect(formatDistance(km)).toBe(expected);
  });
});
