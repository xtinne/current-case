import type { ApiStation, ApiStationDetails } from './station-api.models';
import { mapChargerStatus, mapStation, mapStationAccess, mapStationDetails } from './station.mapper';

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

const apiStationDetails: ApiStationDetails = {
  Name: 'Fjordtunet Hurtiglader',
  Address: 'Testgata 28',
  Town: 'Oslo',
  Latitude: 59.932795,
  Longitude: 10.655307,
  IsOpen: true,
  ChargingStationType: 'Public',
  ChargingPoints: [
    {
      PK_ChargePointID: 990001,
      Name: 'DC 1',
      CurrentStatus: 'Charging',
      MaxKW: 150,
      ConnectorTypes: [{ Name: 'CCS2' }, { Name: 'CHAdeMO' }],
    },
    {
      PK_ChargePointID: 990003,
      Name: 'AC 1',
      CurrentStatus: 'Available',
      MaxKW: 22,
      ConnectorTypes: [{ Name: 'Type - 2' }],
    },
  ],
  Summary: {
    PricingNow: { ChargingCostKWH: 3.9, StartupCostPrice: 0, CostPriceVATPercentage: 25, Currency: 'NOK' },
  },
  SupportInformation: {
    PhoneNumberString: '+47 000 00 000',
    SupportEmail: 'support@example.com',
    SupportWebsite: 'https://example.com',
  },
};

describe('mapChargerStatus', () => {
  it.each([
    ['Available', 'available'],
    ['Charging', 'in-use'],
    ['SuspendedEV', 'in-use'],
    ['Faulted', 'out-of-order'],
    ['Offline', 'out-of-order'],
  ])('maps %s to %s', (apiStatus, expected) => {
    expect(mapChargerStatus(apiStatus)).toBe(expected);
  });

  it('treats an unknown status as out of order', () => {
    expect(mapChargerStatus('SomethingNew')).toBe('out-of-order');
  });
});

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

describe('mapStationDetails', () => {
  it('uses the ID from the station list, since the response has none', () => {
    expect(mapStationDetails(apiStationDetails, 123).id).toBe(123);
  });

  it('maps chargers, price and support', () => {
    const details = mapStationDetails(apiStationDetails, 900110);

    expect(details.chargers).toEqual([
      { id: 990001, name: 'DC 1', status: 'in-use', maxPowerKw: 150, connectorTypes: ['CCS2', 'CHAdeMO'], isDc: true },
      { id: 990003, name: 'AC 1', status: 'available', maxPowerKw: 22, connectorTypes: ['Type 2'], isDc: false },
    ]);
    expect(details.price).toEqual({ perKwh: 3.9, startFee: 0, vatPercent: 25, currency: 'NOK' });
    expect(details.support).toEqual({
      phone: '+47 000 00 000',
      email: 'support@example.com',
      website: 'https://example.com',
    });
  });
});
