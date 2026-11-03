import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import type { Observable } from 'rxjs';
import { map } from 'rxjs';

import { environment } from '@/environments/environment';

import type { ApiResponse, ApiStation } from './station-api.models';
import { mapStation } from './station.mapper';
import type { Station } from './station.model';

@Injectable({ providedIn: 'root' })
export class StationService {
  private readonly http = inject(HttpClient);

  getStations(): Observable<Station[]> {
    return this.http
      .get<ApiResponse<ApiStation[]>>(environment.stationsUrl)
      .pipe(map((response) => response.Result.map(mapStation)));
  }
}
