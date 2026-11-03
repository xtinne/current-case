import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { IonBadge, IonItem, IonLabel, IonNote } from '@ionic/angular';

import type { Station, StationAccess } from '@/app/stations/data/station.model';
import { AVAILABILITY_COLORS, getAvailability } from '@/app/stations/utils/availability';
import { formatDistance } from '@/app/stations/utils/distance';

const ACCESS_LABELS: Record<StationAccess, string | null> = {
  public: null,
  apartment: 'Residents only',
  private: 'Private',
};

@Component({
  selector: 'app-station-list-item',
  templateUrl: 'station-list-item.component.html',
  styleUrl: 'station-list-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IonItem, IonLabel, IonBadge, IonNote],
})
export class StationListItemComponent {
  readonly station = input.required<Station>();
  // Null while the user's location is still unknown.
  readonly distanceKm = input<number | null>(null);

  readonly availability = computed(() => getAvailability(this.station()));
  readonly availabilityColor = computed(() => AVAILABILITY_COLORS[this.availability()]);
  readonly accessLabel = computed(() => ACCESS_LABELS[this.station().access]);

  readonly address = computed(() => {
    const { address, town } = this.station();
    return town ? `${address}, ${town}` : address;
  });

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
