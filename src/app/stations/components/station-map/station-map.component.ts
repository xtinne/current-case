import type { ElementRef } from '@angular/core';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ViewEncapsulation,
  afterNextRender,
  effect,
  inject,
  input,
  output,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import type { FitBoundsOptions, Map as LeafletMap } from 'leaflet';
import { circleMarker, divIcon, latLngBounds, layerGroup, map, marker, tileLayer } from 'leaflet';

import { OSLO_CENTRE } from '@/app/stations/data/location.service';
import type { Position, Station } from '@/app/stations/data/station.model';
import type { Availability } from '@/app/stations/utils/availability';
import { getAvailability } from '@/app/stations/utils/availability';

const DEFAULT_ZOOM = 13;
const FIT_MARGIN = 24;

const PILL_STYLES: Record<Availability, string> = {
  available: 'available',
  full: 'full',
  'out-of-order': 'unavailable',
  closed: 'unavailable',
  'no-chargers': 'unavailable',
};

@Component({
  selector: 'app-station-map',
  template: '<div #map class="station-map"></div>',
  styleUrl: 'station-map.component.scss',
  // Leaflet creates the marker elements itself, so Angular's scoped styles can't reach them.
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StationMapComponent {
  readonly stations = input.required<Station[]>();
  readonly userPosition = input<Position | null>(null);
  readonly selectedStation = input<Station | null>(null);
  readonly coveredTop = input(0);
  readonly coveredLeft = input(0);
  readonly coveredBottomRatio = input(0);
  readonly stationSelected = output<Station>();

  private readonly destroyRef = inject(DestroyRef);
  private readonly mapElement = viewChild.required<ElementRef<HTMLDivElement>>('map');
  private readonly map = signal<LeafletMap | null>(null);
  private readonly stationLayer = layerGroup();
  private readonly userLayer = layerGroup();

  constructor() {
    afterNextRender(() => this.createMap());

    effect(() => this.showStations(this.stations(), this.selectedStation()));

    effect(() => {
      const map = this.map();
      const position = this.userPosition();
      if (map && position) {
        this.showUserPosition(position);
        this.centerOn(map, position);
      }
    });

    effect(() => {
      const map = this.map();
      const station = this.selectedStation();
      if (map && station) {
        this.centerOn(map, station.position);
      }
    });
  }

  private createMap(): void {
    const element = this.mapElement().nativeElement;
    const leafletMap = map(element, { zoomControl: false, attributionControl: false }).setView(
      OSLO_CENTRE,
      DEFAULT_ZOOM,
    );

    tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(leafletMap);
    this.stationLayer.addTo(leafletMap);
    this.userLayer.addTo(leafletMap);

    const resizeObserver = new ResizeObserver(() => leafletMap.invalidateSize());
    resizeObserver.observe(element);

    this.destroyRef.onDestroy(() => {
      resizeObserver.disconnect();
      leafletMap.remove();
    });

    this.map.set(leafletMap);
  }

  private showStations(stations: Station[], selected: Station | null): void {
    this.stationLayer.clearLayers();

    for (const station of stations) {
      const { available, total } = station.chargers;
      const isSelected = station.id === selected?.id;
      const style = isSelected ? 'selected' : PILL_STYLES[getAvailability(station)];
      const label = total > 0 ? `${available}/${total}` : '–';
      const icon = divIcon({
        className: 'station-pin',
        iconSize: [0, 0],
        html: `<div class="station-pill station-pill--${style}"><span class="station-pill__dot"></span>${label}</div>`,
      });

      marker(station.position, {
        icon,
        title: `${station.name}: ${available} of ${total} free`,
        zIndexOffset: isSelected ? 1000 : 0,
      })
        .on('click', () => this.stationSelected.emit(station))
        .addTo(this.stationLayer);
    }
  }

  private showUserPosition(position: Position): void {
    this.userLayer.clearLayers();
    circleMarker(position, { radius: 8, className: 'user-marker' }).addTo(this.userLayer);
  }

  centerOnUser(): void {
    const map = this.map();
    const position = this.userPosition();
    if (map && position) {
      this.centerOn(map, position);
    }
  }

  private centerOn(map: LeafletMap, position: Position): void {
    map.fitBounds(latLngBounds([position, position]), { ...this.visibleAreaPadding(map), maxZoom: DEFAULT_ZOOM });
  }

  private visibleAreaPadding(map: LeafletMap): Pick<FitBoundsOptions, 'paddingTopLeft' | 'paddingBottomRight'> {
    const coveredBottom = map.getSize().y * untracked(this.coveredBottomRatio);
    return {
      paddingTopLeft: [untracked(this.coveredLeft) + FIT_MARGIN, untracked(this.coveredTop) + FIT_MARGIN],
      paddingBottomRight: [FIT_MARGIN, coveredBottom + FIT_MARGIN],
    };
  }
}
