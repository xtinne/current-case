import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { IonIcon, IonSpinner } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { call, chevronBack, globe, lockClosed, mail, navigate } from 'ionicons/icons';

import { ChargerListComponent } from '@/app/stations/components/charger-list/charger-list.component';
import { StateMessageComponent } from '@/app/stations/components/state-message/state-message.component';
import type { ChargerStatus } from '@/app/stations/data/station.model';
import { StationService } from '@/app/stations/data/station.service';
import { ACCESS_LABELS } from '@/app/stations/utils/access';
import { formatAddress } from '@/app/stations/utils/address';
import { formatDistance } from '@/app/stations/utils/distance';

const STATUS_ORDER: ChargerStatus[] = ['available', 'in-use', 'out-of-order'];

@Component({
  selector: 'app-station-details',
  templateUrl: 'station-details.component.html',
  styleUrl: 'station-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DecimalPipe, IonIcon, IonSpinner, StateMessageComponent, ChargerListComponent],
})
export class StationDetailsComponent {
  private readonly stationService = inject(StationService);

  readonly stationId = input.required<number>();
  readonly distanceKm = input<number | null>(null);
  readonly back = output();

  private readonly details = rxResource({
    params: () => this.stationId(),
    stream: ({ params: id }) => this.stationService.getStationDetails(id),
  });

  // value() throws while the resource is in an error state.
  readonly station = computed(() => (this.details.hasValue() ? this.details.value() : undefined));
  readonly isLoading = this.details.isLoading;
  readonly hasError = computed(() => this.details.error() !== undefined);

  readonly address = computed(() => {
    const station = this.station();
    return station ? formatAddress(station) : '';
  });

  readonly distance = computed(() => {
    const distanceKm = this.distanceKm();
    return distanceKm === null ? null : formatDistance(distanceKm);
  });

  readonly accessLabel = computed(() => {
    const station = this.station();
    return station ? ACCESS_LABELS[station.access] : null;
  });

  readonly availableCount = computed(
    () => this.station()?.chargers.filter((charger) => charger.status === 'available').length ?? 0,
  );

  readonly maxPowerKw = computed(() =>
    Math.max(0, ...(this.station()?.chargers.map((charger) => charger.maxPowerKw) ?? [])),
  );

  readonly chargerSegments = computed(() =>
    [...(this.station()?.chargers ?? [])]
      .sort((a, b) => STATUS_ORDER.indexOf(a.status) - STATUS_ORDER.indexOf(b.status))
      .map((charger) => charger.status),
  );

  // tel: links can't contain spaces
  readonly phoneUrl = computed(() => `tel:${this.station()?.support.phone.replace(/\s/g, '')}`);

  readonly directionsUrl = computed(() => {
    const position = this.station()?.position;
    return position ? `https://www.google.com/maps/dir/?api=1&destination=${position.lat},${position.lng}` : null;
  });

  constructor() {
    addIcons({ chevronBack, navigate, call, mail, globe, lockClosed });
  }

  retry(): void {
    this.details.reload();
  }
}
