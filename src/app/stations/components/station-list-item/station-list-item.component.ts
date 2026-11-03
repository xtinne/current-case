import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { IonItem, IonLabel, IonNote } from '@ionic/angular';

import { StationBadgesComponent } from '@/app/stations/components/station-badges/station-badges.component';
import type { Station } from '@/app/stations/data/station.model';
import { formatAddress } from '@/app/stations/utils/address';
import { formatDistance } from '@/app/stations/utils/distance';

@Component({
  selector: 'app-station-list-item',
  templateUrl: 'station-list-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IonItem, IonLabel, IonNote, StationBadgesComponent],
})
export class StationListItemComponent {
  readonly station = input.required<Station>();
  // Null while the user's location is still unknown.
  readonly distanceKm = input<number | null>(null);

  readonly address = computed(() => formatAddress(this.station()));

  readonly connectorTypes = computed(() =>
    this.station()
      .connectors.map((connector) => connector.type)
      .join(' · '),
  );

  readonly distance = computed(() => {
    const distanceKm = this.distanceKm();
    return distanceKm === null ? null : formatDistance(distanceKm);
  });
}
