import type { Station } from '@/app/stations/data/station.model';

import { getAvailability } from './availability';

function station(isOpen: boolean, chargers: Station['chargers']): Station {
  return {
    id: 1,
    name: 'Test station',
    address: 'Testgata 1',
    town: 'Oslo',
    position: { lat: 59.9139, lng: 10.7522 },
    maxPowerKw: 22,
    isOpen,
    access: 'public',
    chargers,
    connectors: [],
  };
}

describe('getAvailability', () => {
  it('is available when at least one charger is free', () => {
    expect(getAvailability(station(true, { total: 8, available: 1, occupied: 5, offline: 2 }))).toBe('available');
  });

  it('is full when no charger is free and some are in use', () => {
    expect(getAvailability(station(true, { total: 8, available: 0, occupied: 6, offline: 2 }))).toBe('full');
  });

  it('is out of order when every charger is offline', () => {
    expect(getAvailability(station(true, { total: 4, available: 0, occupied: 0, offline: 4 }))).toBe('out-of-order');
  });

  it('is closed when the station is closed, even if it reports free chargers', () => {
    expect(getAvailability(station(false, { total: 8, available: 3, occupied: 0, offline: 5 }))).toBe('closed');
  });

  it('has no chargers when the station has none, even if it is open', () => {
    expect(getAvailability(station(true, { total: 0, available: 0, occupied: 0, offline: 0 }))).toBe('no-chargers');
  });
});
