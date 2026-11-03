import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { IonIcon } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { flash } from 'ionicons/icons';

import type { Charger, ChargerStatus } from '@/app/stations/data/station.model';
import { FAST_CHARGING_MIN_KW } from '@/app/stations/utils/filters';

const CHARGER_STATUS_LABELS: Record<ChargerStatus, string> = {
  available: 'Available',
  'in-use': 'In use',
  'out-of-order': 'Out of order',
};

@Component({
  selector: 'app-charger-list',
  templateUrl: 'charger-list.component.html',
  styleUrl: 'charger-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IonIcon],
})
export class ChargerListComponent {
  readonly chargers = input.required<Charger[]>();

  readonly statusLabels = CHARGER_STATUS_LABELS;
  readonly fastChargingMinKw = FAST_CHARGING_MIN_KW;

  constructor() {
    addIcons({ flash });
  }
}
