import type { ApiStation } from './station-api.models';
import { mapStation, mapStationAccess } from './station.mapper';

const apiStation: ApiStation = {
  PK_ChargingStationID: 900110,
  Name: 'Fjordtunet Hurtiglader',
  Address: 'Testgata 28',
  Town: 'Oslo',
  Latitude: 59.932795,
  Longitude: 10.655307,
  kWhMax: 150,
  IsOpen: true,
  availableBoxes: 4,
  occupiedBoxes: 2,
  offlineBoxes: 2,
  totalBoxes: 8,
  Connectors: [
    { Name: 'CCS2', Amount: 2, Available: 1 },
    { Name: 'Type - 2', Amount: 6, Available: 3 },
  ],
  ChargingStationType: 'Public',
};

describe('mapStationAccess', () => {
  it.each([
    ['Public', 'public'],
    ['AppartmentBuilding', 'apartment'],
    ['PrivateParking', 'private'],
  ])('maps %s to %s', (apiType, expected) => {
    expect(mapStationAccess(apiType)).toBe(expected);
  });

  it('treats an unknown type as private', () => {
    expect(mapStationAccess('SomethingNew')).toBe('private');
  });
});

describe('mapStation', () => {
  it('maps an API station to the app model', () => {
    expect(mapStation(apiStation)).toEqual({
      id: 900110,
      name: 'Fjordtunet Hurtiglader',
      address: 'Testgata 28',
      town: 'Oslo',
      position: { lat: 59.932795, lng: 10.655307 },
      maxPowerKw: 150,
      isOpen: true,
      access: 'public',
      chargers: { total: 8, available: 4, occupied: 2, offline: 2 },
      connectors: [
        { type: 'CCS2', total: 2, available: 1 },
        { type: 'Type 2', total: 6, available: 3 },
      ],
    });
  });

  it('maps a station without chargers', () => {
    const station = mapStation({
      ...apiStation,
      availableBoxes: 0,
      occupiedBoxes: 0,
      offlineBoxes: 0,
      totalBoxes: 0,
      Connectors: [],
    });

    expect(station.chargers).toEqual({ total: 0, available: 0, occupied: 0, offline: 0 });
    expect(station.connectors).toEqual([]);
  });
});
