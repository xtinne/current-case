import type { ApiStation } from './station-api.models';
import type { Station, StationAccess } from './station.model';

const STATION_ACCESS: Record<string, StationAccess> = {
  Public: 'public',
  AppartmentBuilding: 'apartment',
  PrivateParking: 'private',
};

// Unknown types count as private, so a station is never shown as open to everyone by mistake.
export function mapStationAccess(type: string): StationAccess {
  return STATION_ACCESS[type] ?? 'private';
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
