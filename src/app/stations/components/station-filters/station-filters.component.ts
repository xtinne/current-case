import { ChangeDetectionStrategy, Component, computed, input, linkedSignal, output } from '@angular/core';
import { IonIcon, IonToggle } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { checkmark, close, refresh } from 'ionicons/icons';

import type { Station } from '@/app/stations/data/station.model';
import type { StationFilters } from '@/app/stations/utils/filters';
import {
  NO_FILTERS,
  PLUG_DESCRIPTIONS,
  POWER_OPTIONS,
  countActiveFilters,
  filterStations,
  getConnectorTypes,
} from '@/app/stations/utils/filters';

@Component({
  selector: 'app-station-filters',
  templateUrl: 'station-filters.component.html',
  styleUrl: 'station-filters.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IonToggle, IonIcon],
})
export class StationFiltersComponent {
  readonly filters = input.required<StationFilters>();
  readonly stations = input.required<Station[]>();
  readonly apply = output<StationFilters>();
  readonly dismiss = output();

  readonly powerOptions = POWER_OPTIONS;
  readonly plugDescriptions = PLUG_DESCRIPTIONS;

  // A draft copy of the filters: changes only apply when the user taps "Show X stations".
  readonly draft = linkedSignal(() => this.filters());
  readonly connectorTypes = computed(() => getConnectorTypes(this.stations()));
  readonly matchCount = computed(() => filterStations(this.stations(), this.draft()).length);
  readonly canReset = computed(() => countActiveFilters(this.draft()) > 0);

  constructor() {
    addIcons({ close, refresh, checkmark });
  }

  update(changes: Partial<StationFilters>): void {
    this.draft.update((draft) => ({ ...draft, ...changes }));
  }

  toggleConnectorType(type: string): void {
    const selected = this.draft().connectorTypes;
    this.update({
      connectorTypes: selected.includes(type) ? selected.filter((t) => t !== type) : [...selected, type],
    });
  }

  reset(): void {
    this.draft.set(NO_FILTERS);
  }
}
