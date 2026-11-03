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
