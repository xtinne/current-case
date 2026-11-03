import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { IonBadge } from '@ionic/angular';

import type { Station, StationAccess } from '@/app/stations/data/station.model';
import { AVAILABILITY_COLORS, getAvailability } from '@/app/stations/utils/availability';

const ACCESS_LABELS: Record<StationAccess, string | null> = {
  public: null,
  apartment: 'Residents only',
  private: 'Private',
};

// Availability and access badges, shared by the station list and the detail page.
@Component({
  selector: 'app-station-badges',
  templateUrl: 'station-badges.component.html',
  styleUrl: 'station-badges.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IonBadge],
})
export class StationBadgesComponent {
  readonly station = input.required<Pick<Station, 'isOpen' | 'chargers' | 'access'>>();

  readonly availability = computed(() => getAvailability(this.station()));
  readonly availabilityColor = computed(() => AVAILABILITY_COLORS[this.availability()]);
  readonly accessLabel = computed(() => ACCESS_LABELS[this.station().access]);
}
