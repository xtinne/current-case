import type { Station, StationAccess } from '@/app/stations/data/station.model';

import { NO_FILTERS, countActiveFilters, filterStations, getConnectorTypes } from './filters';

function station(
  id: number,
  { maxPowerKw = 22, available = 1, isOpen = true, plugs = ['Type 2'], access = 'public' as StationAccess } = {},
): Station {
  return {
    id,
    name: `Station ${id}`,
    address: 'Testgata 1',
    town: 'Oslo',
    position: { lat: 59.9139, lng: 10.7522 },
    maxPowerKw,
    isOpen,
    access,
    chargers: { total: 4, available, occupied: 4 - available, offline: 0 },
    connectors: plugs.map((type) => ({ type, total: 1, available: 1 })),
  };
}

const ids = (result: Station[]): number[] => result.map((s) => s.id);

describe('filterStations', () => {
  const stations = [
    station(1),
    station(2, { available: 0 }),
    station(3, { isOpen: false }),
    station(4, { maxPowerKw: 150, plugs: ['CCS2', 'CHAdeMO'] }),
    station(5, { maxPowerKw: 11, access: 'apartment' }),
  ];

  it('returns every station without filters', () => {
    expect(ids(filterStations(stations, NO_FILTERS))).toEqual([1, 2, 3, 4, 5]);
  });

  it('keeps only stations with a free charger, not closed ones', () => {
    expect(ids(filterStations(stations, { ...NO_FILTERS, availableNow: true }))).toEqual([1, 4, 5]);
  });

  it('keeps stations with at least one of the chosen plug types', () => {
    expect(ids(filterStations(stations, { ...NO_FILTERS, connectorTypes: ['CHAdeMO', 'Type 2'] }))).toEqual([
      1, 2, 3, 4, 5,
    ]);
    expect(ids(filterStations(stations, { ...NO_FILTERS, connectorTypes: ['CCS2'] }))).toEqual([4]);
  });

  it('keeps stations with at least the minimum power', () => {
    expect(ids(filterStations(stations, { ...NO_FILTERS, minPowerKw: 22 }))).toEqual([1, 2, 3, 4]);
    expect(ids(filterStations(stations, { ...NO_FILTERS, minPowerKw: 50 }))).toEqual([4]);
  });

  it('hides residents-only and private stations', () => {
    expect(ids(filterStations(stations, { ...NO_FILTERS, hidePrivate: true }))).toEqual([1, 2, 3, 4]);
  });

  it('combines filters', () => {
    expect(ids(filterStations(stations, { ...NO_FILTERS, availableNow: true, minPowerKw: 22 }))).toEqual([1, 4]);
  });
});

describe('countActiveFilters', () => {
  it('counts each filter that differs from the default', () => {
    expect(countActiveFilters(NO_FILTERS)).toBe(0);
    expect(
      countActiveFilters({
        availableNow: true,
        connectorTypes: ['CCS2', 'Type 2'],
        minPowerKw: 50,
        hidePrivate: false,
      }),
    ).toBe(3);
  });
});

describe('getConnectorTypes', () => {
  it('lists each plug type once, sorted', () => {
    expect(getConnectorTypes([station(1, { plugs: ['Type 2', 'CCS2'] }), station(2, { plugs: ['CCS2'] })])).toEqual([
      'CCS2',
      'Type 2',
    ]);
  });
});
