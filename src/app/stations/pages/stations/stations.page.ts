import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  IonContent,
  IonHeader,
  IonLabel,
  IonList,
  IonListHeader,
  IonModal,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/angular';

import { StationListItemComponent } from '@/app/stations/components/station-list-item/station-list-item.component';
import { StationMapComponent } from '@/app/stations/components/station-map/station-map.component';
import type { UserLocation } from '@/app/stations/data/location.service';
import { LocationService } from '@/app/stations/data/location.service';
import { StationService } from '@/app/stations/data/station.service';
import { sortByDistance } from '@/app/stations/utils/distance';

const SHEET_BREAKPOINTS = { collapsed: 0.15, half: 0.5, full: 1 };

@Component({
  selector: 'app-stations',
  templateUrl: 'stations.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonModal,
    IonList,
    IonListHeader,
    IonLabel,
    IonText,
    StationMapComponent,
    StationListItemComponent,
  ],
})
export class StationsPage {
  private readonly stationService = inject(StationService);
  private readonly locationService = inject(LocationService);

  readonly sheetBreakpoints = Object.values(SHEET_BREAKPOINTS);
  readonly sheetInitialBreakpoint = SHEET_BREAKPOINTS.half;

  readonly stations = toSignal(this.stationService.getStations(), { initialValue: [] });
  readonly location = signal<UserLocation | null>(null);

  // Unsorted, without distances, until the location is known.
  readonly stationsByDistance = computed(() => {
    const location = this.location();
    const stations = this.stations();

    return location
      ? sortByDistance(stations, location.position)
      : stations.map((station) => ({ station, distanceKm: null }));
  });

  constructor() {
    this.locationService.getLocation().then((location) => this.location.set(location));
  }
}
