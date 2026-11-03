// Raw API response shapes, as the backend sends them.
// Only the fields the app uses are typed; everything else is ignored.

export interface ApiResponse<T> {
  Result: T;
}

export interface ApiConnector {
  Name: string;
  Amount: number;
  Available: number;
}

export interface ApiStation {
  PK_ChargingStationID: number;
  Name: string;
  Address: string;
  Town: string;
  Latitude: number;
  Longitude: number;
  // Named kWh by the API, but the values are kW (power, not energy).
  kWhMax: number;
  IsOpen: boolean;
  availableBoxes: number;
  occupiedBoxes: number;
  offlineBoxes: number;
  totalBoxes: number;
  Connectors: ApiConnector[];
  ChargingStationType: string;
}

export interface ApiChargePoint {
  PK_ChargePointID: number;
  Name: string;
  CurrentStatus: string;
  MaxKW: number;
  ConnectorTypes: { Name: string }[];
}

export interface ApiStationDetails {
  Name: string;
  Address: string;
  Town: string;
  Latitude: number;
  Longitude: number;
  IsOpen: boolean;
  ChargingStationType: string;
  ChargingPoints: ApiChargePoint[];
  Summary: {
    PricingNow: {
      ChargingCostKWH: number;
      StartupCostPrice: number;
      CostPriceVATPercentage: number;
      Currency: string;
    };
  };
  SupportInformation: {
    PhoneNumberString: string;
    SupportEmail: string;
    SupportWebsite: string;
  };
}
