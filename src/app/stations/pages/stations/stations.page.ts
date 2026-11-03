import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  Injector,
  afterNextRender,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { IonContent, IonIcon, IonModal, IonSpinner, IonText } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { navigate } from 'ionicons/icons';

import { MapToolbarComponent } from '@/app/stations/components/map-toolbar/map-toolbar.component';
import { StateMessageComponent } from '@/app/stations/components/state-message/state-message.component';
import { StationDetailsComponent } from '@/app/stations/components/station-details/station-details.component';
import { StationFiltersComponent } from '@/app/stations/components/station-filters/station-filters.component';
import { StationListItemComponent } from '@/app/stations/components/station-list-item/station-list-item.component';
import { StationMapComponent } from '@/app/stations/components/station-map/station-map.component';
import type { UserLocation } from '@/app/stations/data/location.service';
import { LocationService } from '@/app/stations/data/location.service';
import type { Station } from '@/app/stations/data/station.model';
import { StationService } from '@/app/stations/data/station.service';
import { getAvailability } from '@/app/stations/utils/availability';
import { sortByDistance } from '@/app/stations/utils/distance';
import type { StationFilters } from '@/app/stations/utils/filters';
import { NO_FILTERS, filterStations, getConnectorTypes, searchStations } from '@/app/stations/utils/filters';

const SHEET_BREAKPOINTS = { collapsed: 0.15, half: 0.5, full: 1 };
const MAP_TOOLBAR_HEIGHT = 130;
const WIDE_SCREEN_QUERY = '(min-width: 992px)';
const SIDE_PANEL_WIDTH = 440;

@Component({
  selector: 'app-stations',
  templateUrl: 'stations.page.html',
  styleUrl: 'stations.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    IonContent,
    IonModal,
    IonText,
    IonSpinner,
    IonIcon,
    MapToolbarComponent,
    StateMessageComponent,
    StationMapComponent,
    StationListItemComponent,
    StationDetailsComponent,
    StationFiltersComponent,
  ],
})
export class StationsPage {
  private readonly stationService = inject(StationService);
  private readonly locationService = inject(LocationService);
  private readonly injector = inject(Injector);
  private readonly sheet = viewChild.required<IonModal>('sheet');
  private readonly map = viewChild.required(StationMapComponent);
  private readonly sheetContent = viewChild<IonContent>('sheetContent');
  private listScrollTop = 0;

  private readonly wideScreenQuery = window.matchMedia(WIDE_SCREEN_QUERY);
  readonly isWideScreen = signal(this.wideScreenQuery.matches);

  readonly sheetBreakpoints = Object.values(SHEET_BREAKPOINTS);
  readonly sheetInitialBreakpoint = this.isWideScreen() ? SHEET_BREAKPOINTS.full : SHEET_BREAKPOINTS.half;
  readonly sheetBreakpoint = signal(this.sheetInitialBreakpoint);

  // Parts of the map hidden behind the sheet and toolbar, so the map centres content in the visible part.
  readonly mapCoveredLeft = computed(() => (this.isWideScreen() ? SIDE_PANEL_WIDTH : 0));
  readonly mapCoveredTop = computed(() => (this.isWideScreen() ? 0 : MAP_TOOLBAR_HEIGHT));
  readonly mapCoveredBottomRatio = computed(() => (this.isWideScreen() ? 0 : this.sheetBreakpoint()));

  readonly aboveSheet = computed(() => {
    if (this.isWideScreen()) {
      return '16px';
    }
    return this.sheetBreakpoint() < SHEET_BREAKPOINTS.full ? `calc(${this.sheetBreakpoint() * 100}% + 16px)` : null;
  });

  private readonly stationsResource = rxResource({ stream: () => this.stationService.getStations() });

  readonly stations = computed(() => (this.stationsResource.hasValue() ? this.stationsResource.value() : []));
  readonly location = signal<UserLocation | null>(null);
  readonly isLoadingStations = computed(() => this.stationsResource.isLoading() || this.location() === null);
  readonly hasStationsError = computed(() => this.stationsResource.error() !== undefined);
  readonly selectedStation = signal<Station | null>(null);
  readonly filters = signal<StationFilters>(NO_FILTERS);
  readonly isFilterSheetOpen = signal(false);
  readonly connectorTypes = computed(() => getConnectorTypes(this.stations()));

  // Shared by the map and the list, so both always show the same stations.
  readonly searchQuery = signal('');

  readonly searchedStations = computed(() => searchStations(this.stations(), this.searchQuery()));
  readonly filteredStations = computed(() => filterStations(this.searchedStations(), this.filters()));

  readonly availableNowCount = computed(
    () => this.filteredStations().filter((station) => getAvailability(station) === 'available').length,
  );

  readonly stationsByDistance = computed(() => {
    const location = this.location();
    return location ? sortByDistance(this.filteredStations(), location.position) : [];
  });

  readonly selectedDistanceKm = computed(() => {
    const selected = this.selectedStation();
    return this.stationsByDistance().find((item) => item.station.id === selected?.id)?.distanceKm ?? null;
  });

  constructor() {
    addIcons({ navigate });
    this.locationService.getLocation().then((location) => this.location.set(location));

    const onScreenSizeChange = (event: MediaQueryListEvent): void => this.switchLayout(event.matches);
    this.wideScreenQuery.addEventListener('change', onScreenSizeChange);
    inject(DestroyRef).onDestroy(() => this.wideScreenQuery.removeEventListener('change', onScreenSizeChange));
  }

  private switchLayout(isWideScreen: boolean): void {
    this.isWideScreen.set(isWideScreen);
    this.sheet().setCurrentBreakpoint(isWideScreen ? SHEET_BREAKPOINTS.full : SHEET_BREAKPOINTS.half);
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

  locate(): void {
    this.map().centerOnUser();
  }

  reloadStations(): void {
    this.stationsResource.reload();
  }

  applyFilters(filters: StationFilters): void {
    this.filters.set(filters);
    this.isFilterSheetOpen.set(false);
  }

  clearSearchAndFilters(): void {
    this.searchQuery.set('');
    this.filters.set(NO_FILTERS);
  }
}
