import type { ApiStation, ApiStationDetails } from './station-api.models';
import type { ChargerStatus, Station, StationAccess, StationDetails } from './station.model';

const STATION_ACCESS: Record<string, StationAccess> = {
  Public: 'public',
  AppartmentBuilding: 'apartment',
  PrivateParking: 'private',
};

const CHARGER_STATUSES: Record<string, ChargerStatus> = {
  Available: 'available',
  Charging: 'in-use',
  SuspendedEV: 'in-use',
  Faulted: 'out-of-order',
  Offline: 'out-of-order',
};

const DC_CONNECTOR_TYPES = ['CCS2', 'CHAdeMO'];

// Unknown types count as private, so a station is never shown as open to everyone by mistake.
export function mapStationAccess(type: string): StationAccess {
  return STATION_ACCESS[type] ?? 'private';
}

// Unknown statuses count as out of order, so a charger is never shown as available by mistake.
export function mapChargerStatus(status: string): ChargerStatus {
  return CHARGER_STATUSES[status] ?? 'out-of-order';
}

// "Type - 2" -> "Type 2"
export function mapConnectorType(name: string): string {
  return name.replace(' - ', ' ');
}

export function mapStation(api: ApiStation): Station {
  return {
    id: api.PK_ChargingStationID,
    name: api.Name,
    address: api.Address,
    town: api.Town,
    position: { lat: api.Latitude, lng: api.Longitude },
    maxPowerKw: api.kWhMax,
    isOpen: api.IsOpen,
    access: mapStationAccess(api.ChargingStationType),
    chargers: {
      total: api.totalBoxes,
      available: api.availableBoxes,
      occupied: api.occupiedBoxes,
      offline: api.offlineBoxes,
    },
    connectors: api.Connectors.map((connector) => ({
      type: mapConnectorType(connector.Name),
      total: connector.Amount,
      available: connector.Available,
    })),
  };
}

export function mapStationDetails(api: ApiStationDetails, id: number): StationDetails {
  const pricing = api.Summary.PricingNow;
  const support = api.SupportInformation;

  return {
    id,
    name: api.Name,
    address: api.Address,
    town: api.Town,
    position: { lat: api.Latitude, lng: api.Longitude },
    isOpen: api.IsOpen,
    access: mapStationAccess(api.ChargingStationType),
    chargers: api.ChargingPoints.map((point) => {
      const connectorTypes = point.ConnectorTypes.map((connector) => mapConnectorType(connector.Name));
      return {
        id: point.PK_ChargePointID,
        name: point.Name,
        status: mapChargerStatus(point.CurrentStatus),
        maxPowerKw: point.MaxKW,
        connectorTypes,
        // The API has no AC/DC field, so it comes from the plug type.
        isDc: connectorTypes.some((type) => DC_CONNECTOR_TYPES.includes(type)),
      };
    }),
    price: {
      perKwh: pricing.ChargingCostKWH,
      startFee: pricing.StartupCostPrice,
      vatPercent: pricing.CostPriceVATPercentage,
      currency: pricing.Currency,
    },
    support: {
      phone: support.PhoneNumberString,
      email: support.SupportEmail,
      website: support.SupportWebsite,
    },
  };
}
