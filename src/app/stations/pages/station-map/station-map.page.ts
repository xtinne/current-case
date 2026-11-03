import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { IonContent, IonHeader, IonList, IonText, IonTitle, IonToolbar } from '@ionic/angular';

import { StationListItemComponent } from '@/app/stations/components/station-list-item/station-list-item.component';
import type { UserLocation } from '@/app/stations/data/location.service';
import { LocationService } from '@/app/stations/data/location.service';
import { StationService } from '@/app/stations/data/station.service';
import { sortByDistance } from '@/app/stations/utils/distance';

@Component({
  selector: 'app-station-map',
  templateUrl: 'station-map.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonText, StationListItemComponent],
})
export class StationMapPage {
  private readonly stationService = inject(StationService);
  private readonly locationService = inject(LocationService);

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
