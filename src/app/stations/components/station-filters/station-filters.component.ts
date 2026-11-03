import { ChangeDetectionStrategy, Component, computed, input, linkedSignal, output } from '@angular/core';
import {
  IonButton,
  IonButtons,
  IonCheckbox,
  IonContent,
  IonFooter,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonSegment,
  IonSegmentButton,
  IonTitle,
  IonToggle,
  IonToolbar,
} from '@ionic/angular';

import type { Station } from '@/app/stations/data/station.model';
import type { StationFilters } from '@/app/stations/utils/filters';
import { NO_FILTERS, POWER_OPTIONS, filterStations, getConnectorTypes } from '@/app/stations/utils/filters';

@Component({
  selector: 'app-station-filters',
  templateUrl: 'station-filters.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'ion-page' },
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonContent,
    IonList,
    IonListHeader,
    IonItem,
    IonLabel,
    IonToggle,
    IonCheckbox,
    IonSegment,
    IonSegmentButton,
    IonFooter,
  ],
})
export class StationFiltersComponent {
  readonly filters = input.required<StationFilters>();
  readonly stations = input.required<Station[]>();
  readonly apply = output<StationFilters>();
  readonly dismiss = output();

  readonly powerOptions = POWER_OPTIONS;

  readonly draft = linkedSignal(() => this.filters());
  readonly connectorTypes = computed(() => getConnectorTypes(this.stations()));
  readonly matchCount = computed(() => filterStations(this.stations(), this.draft()).length);

  update(changes: Partial<StationFilters>): void {
    this.draft.update((draft) => ({ ...draft, ...changes }));
  }

  setMinPower(value: string | number | undefined): void {
    this.update({ minPowerKw: Number(value ?? 0) });
  }

  toggleConnectorType(type: string, checked: boolean): void {
    const selected = this.draft().connectorTypes;
    this.update({ connectorTypes: checked ? [...selected, type] : selected.filter((t) => t !== type) });
  }

  reset(): void {
    this.draft.set(NO_FILTERS);
  }
}
