import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { IonIcon } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { closeCircle, optionsOutline, search } from 'ionicons/icons';

import type { StationFilters } from '@/app/stations/utils/filters';
import { FAST_CHARGING_MIN_KW, countActiveFilters } from '@/app/stations/utils/filters';

interface QuickFilter {
  label: string;
  active: boolean;
  toggled: StationFilters;
}

@Component({
  selector: 'app-map-toolbar',
  templateUrl: 'map-toolbar.component.html',
  styleUrl: 'map-toolbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IonIcon],
})
export class MapToolbarComponent {
  readonly filters = input.required<StationFilters>();
  readonly connectorTypes = input.required<string[]>();
  readonly query = input.required<string>();
  readonly queryChange = output<string>();
  readonly filtersChange = output<StationFilters>();
  readonly openFilters = output();

  readonly activeCount = computed(() => countActiveFilters(this.filters()));

  readonly quickFilters = computed<QuickFilter[]>(() => {
    const filters = this.filters();
    const isFast = filters.minPowerKw >= FAST_CHARGING_MIN_KW;

    return [
      {
        label: 'Available now',
        active: filters.availableNow,
        toggled: { ...filters, availableNow: !filters.availableNow },
      },
      {
        label: `${FAST_CHARGING_MIN_KW} kW+`,
        active: isFast,
        toggled: { ...filters, minPowerKw: isFast ? 0 : FAST_CHARGING_MIN_KW },
      },
      ...this.connectorTypes().map((type) => {
        const active = filters.connectorTypes.includes(type);
        return {
          label: type,
          active,
          toggled: {
            ...filters,
            connectorTypes: active
              ? filters.connectorTypes.filter((t) => t !== type)
              : [...filters.connectorTypes, type],
          },
        };
      }),
      {
        label: 'Public only',
        active: filters.hidePrivate,
        toggled: { ...filters, hidePrivate: !filters.hidePrivate },
      },
    ];
  });

  constructor() {
    addIcons({ search, closeCircle, optionsOutline });
  }
}
