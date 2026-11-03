import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import {
  IonBadge,
  IonButton,
  IonButtons,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonNote,
  IonSpinner,
  IonTitle,
  IonToolbar,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { arrowBack, call, globe, mail, navigate } from 'ionicons/icons';

import { LoadErrorComponent } from '@/app/stations/components/load-error/load-error.component';
import { StationBadgesComponent } from '@/app/stations/components/station-badges/station-badges.component';
import type { ChargerStatus } from '@/app/stations/data/station.model';
import { StationService } from '@/app/stations/data/station.service';
import { formatAddress } from '@/app/stations/utils/address';
import { countChargers } from '@/app/stations/utils/availability';

const CHARGER_STATUSES: Record<ChargerStatus, { label: string; color: string }> = {
  available: { label: 'Available', color: 'success' },
  'in-use': { label: 'In use', color: 'warning' },
  'out-of-order': { label: 'Out of order', color: 'danger' },
};

@Component({
  selector: 'app-station-details',
  templateUrl: 'station-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DecimalPipe,
    IonToolbar,
    IonButtons,
    IonTitle,
    IonButton,
    IonIcon,
    IonList,
    IonListHeader,
    IonItem,
    IonLabel,
    IonBadge,
    IonNote,
    IonSpinner,
    StationBadgesComponent,
    LoadErrorComponent,
  ],
})
export class StationDetailsComponent {
  private readonly stationService = inject(StationService);

  readonly stationId = input.required<number>();
  readonly back = output();

  readonly chargerStatuses = CHARGER_STATUSES;

  private readonly details = rxResource({
    params: () => this.stationId(),
    stream: ({ params: id }) => this.stationService.getStationDetails(id),
  });

  // value() throws while the resource is in an error state.
  readonly station = computed(() => (this.details.hasValue() ? this.details.value() : undefined));
  readonly isLoading = this.details.isLoading;
  readonly hasError = computed(() => this.details.error() !== undefined);

  readonly badgeStation = computed(() => {
    const station = this.station();
    return station && { ...station, chargers: countChargers(station.chargers) };
  });

  readonly address = computed(() => {
    const station = this.station();
    return station ? formatAddress(station) : '';
  });

  // tel: links can't contain spaces
  readonly phoneUrl = computed(() => `tel:${this.station()?.support.phone.replace(/\s/g, '')}`);

  readonly directionsUrl = computed(() => {
    const position = this.station()?.position;
    return position ? `https://www.google.com/maps/dir/?api=1&destination=${position.lat},${position.lng}` : null;
  });

  constructor() {
    addIcons({ arrowBack, navigate, call, mail, globe });
  }

  retry(): void {
    this.details.reload();
  }
}
