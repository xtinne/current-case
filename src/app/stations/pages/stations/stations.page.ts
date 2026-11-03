import {
  ChangeDetectionStrategy,
  Component,
  Injector,
  afterNextRender,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import {
  IonContent,
  IonHeader,
  IonLabel,
  IonList,
  IonListHeader,
  IonModal,
  IonSpinner,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/angular';

import { LoadErrorComponent } from '@/app/stations/components/load-error/load-error.component';
import { StationDetailsComponent } from '@/app/stations/components/station-details/station-details.component';
import { StationListItemComponent } from '@/app/stations/components/station-list-item/station-list-item.component';
import { StationMapComponent } from '@/app/stations/components/station-map/station-map.component';
import type { UserLocation } from '@/app/stations/data/location.service';
import { LocationService } from '@/app/stations/data/location.service';
import type { Station } from '@/app/stations/data/station.model';
import { StationService } from '@/app/stations/data/station.service';
import { sortByDistance } from '@/app/stations/utils/distance';

const SHEET_BREAKPOINTS = { collapsed: 0.15, half: 0.5, full: 1 };

@Component({
  selector: 'app-stations',
  templateUrl: 'stations.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonModal,
    IonList,
    IonListHeader,
    IonLabel,
    IonText,
    IonSpinner,
    LoadErrorComponent,
    StationMapComponent,
    StationListItemComponent,
    StationDetailsComponent,
  ],
})
export class StationsPage {
  private readonly stationService = inject(StationService);
  private readonly locationService = inject(LocationService);
  private readonly injector = inject(Injector);
  private readonly sheet = viewChild.required(IonModal);
  private readonly sheetContent = viewChild<IonContent>('sheetContent');
  private listScrollTop = 0;

  readonly sheetBreakpoints = Object.values(SHEET_BREAKPOINTS);
  readonly sheetInitialBreakpoint = SHEET_BREAKPOINTS.half;

  private readonly stationsResource = rxResource({ stream: () => this.stationService.getStations() });

  readonly stations = computed(() => (this.stationsResource.hasValue() ? this.stationsResource.value() : []));
  readonly location = signal<UserLocation | null>(null);
  readonly isLoadingStations = computed(() => this.stationsResource.isLoading() || this.location() === null);
  readonly hasStationsError = computed(() => this.stationsResource.error() !== undefined);
  readonly selectedStation = signal<Station | null>(null);

  readonly stationsByDistance = computed(() => {
    const location = this.location();
    return location ? sortByDistance(this.stations(), location.position) : [];
  });

  constructor() {
    this.locationService.getLocation().then((location) => this.location.set(location));
  }

  async openStation(station: Station): Promise<void> {
    if (this.selectedStation() === null) {
      this.listScrollTop = (await this.sheetContent()?.getScrollElement())?.scrollTop ?? 0;
    }
    this.selectedStation.set(station);
    this.sheetContent()?.scrollToTop();

    // A collapsed sheet would hide the details the user just asked for.
    const sheet = this.sheet();
    if ((await sheet.getCurrentBreakpoint()) === SHEET_BREAKPOINTS.collapsed) {
      await sheet.setCurrentBreakpoint(SHEET_BREAKPOINTS.half);
    }
  }

  closeStation(): void {
    this.selectedStation.set(null);
    afterNextRender(() => this.sheetContent()?.scrollToPoint(0, this.listScrollTop), { injector: this.injector });
  }

  reloadStations(): void {
    this.stationsResource.reload();
  }
}
