import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { IonIcon } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { flash, lockClosed } from 'ionicons/icons';

import type { Station } from '@/app/stations/data/station.model';
import { ACCESS_LABELS } from '@/app/stations/utils/access';
import { formatAddress } from '@/app/stations/utils/address';
import type { Availability } from '@/app/stations/utils/availability';
import { getAvailability } from '@/app/stations/utils/availability';
import { formatDistance } from '@/app/stations/utils/distance';
import { FAST_CHARGING_MIN_KW } from '@/app/stations/utils/filters';

const STATUS_COLORS: Record<Availability, string> = {
  available: 'var(--app-color-available-text)',
  full: 'var(--app-color-in-use-text)',
  'out-of-order': 'var(--ion-color-medium)',
  closed: 'var(--ion-color-medium)',
  'no-chargers': 'var(--ion-color-medium)',
};

@Component({
  selector: 'app-station-list-item',
  templateUrl: 'station-list-item.component.html',
  styleUrl: 'station-list-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IonIcon],
})
export class StationListItemComponent {
  readonly station = input.required<Station>();
  readonly distanceKm = input.required<number>();

  readonly address = computed(() => formatAddress(this.station()));
  readonly distance = computed(() => formatDistance(this.distanceKm()));
  readonly connectorTypes = computed(() => this.station().connectors.map((connector) => connector.type));
  readonly accessLabel = computed(() => ACCESS_LABELS[this.station().access]);
  readonly isFast = computed(() => this.station().maxPowerKw >= FAST_CHARGING_MIN_KW);

  readonly availability = computed(() => getAvailability(this.station()));
  readonly statusColor = computed(() => STATUS_COLORS[this.availability()]);

  readonly statusLabel = computed(() => {
    const { available, total } = this.station().chargers;
    switch (this.availability()) {
      case 'available':
        return `${available} of ${total} free`;
      case 'full':
        return 'All in use';
      case 'out-of-order':
        return 'Out of order';
      case 'closed':
        return 'Closed';
      case 'no-chargers':
        return 'No chargers';
    }
  });

  readonly barSegments = computed(() => {
    const { available, occupied, offline } = this.station().chargers;
    const availability = this.availability();
    if (availability === 'closed' || availability === 'no-chargers') {
      return [{ count: 1, color: 'var(--app-color-offline)' }];
    }
    return [
      { count: available, color: 'var(--ion-color-success)' },
      { count: occupied, color: 'var(--ion-color-warning)' },
      { count: offline, color: 'var(--app-color-offline)' },
    ].filter((segment) => segment.count > 0);
  });

  constructor() {
    addIcons({ flash, lockClosed });
  }
}
