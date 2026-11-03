export interface Position {
  lat: number;
  lng: number;
}

export type StationAccess = 'public' | 'apartment' | 'private';

export interface Connector {
  type: string;
  total: number;
  available: number;
}

export interface Station {
  id: number;
  name: string;
  address: string;
  town: string;
  position: Position;
  maxPowerKw: number;
  isOpen: boolean;
  access: StationAccess;
  chargers: {
    total: number;
    available: number;
    occupied: number;
    offline: number;
  };
  connectors: Connector[];
}

export type ChargerStatus = 'available' | 'in-use' | 'out-of-order';

export interface Charger {
  id: number;
  name: string;
  status: ChargerStatus;
  maxPowerKw: number;
  connectorTypes: string[];
  isDc: boolean;
}

export interface StationDetails {
  id: number;
  name: string;
  address: string;
  town: string;
  position: Position;
  isOpen: boolean;
  access: StationAccess;
  chargers: Charger[];
  price: {
    perKwh: number;
    startFee: number;
    vatPercent: number;
    currency: string;
  };
  support: {
    phone: string;
    email: string;
    website: string;
  };
}
