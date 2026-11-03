import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import type { Observable } from 'rxjs';
import { map } from 'rxjs';

import { environment } from '@/environments/environment';

import type { ApiResponse, ApiStation, ApiStationDetails } from './station-api.models';
import { mapStation, mapStationDetails } from './station.mapper';
import type { Station, StationDetails } from './station.model';

@Injectable({ providedIn: 'root' })
export class StationService {
  private readonly http = inject(HttpClient);

  getStations(): Observable<Station[]> {
    return this.http
      .get<ApiResponse<ApiStation[]>>(environment.stationsUrl)
      .pipe(map((response) => response.Result.map(mapStation)));
  }

  // The mock endpoint returns the same station for every ID.
  getStationDetails(id: number): Observable<StationDetails> {
    return this.http
      .get<ApiResponse<ApiStationDetails>>(environment.stationDetailsUrl)
      .pipe(map((response) => mapStationDetails(response.Result, id)));
  }
}
