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
  signal,
  viewChild,
} from '@angular/core';
import type { Map as LeafletMap } from 'leaflet';
import { circleMarker, divIcon, latLngBounds, layerGroup, map, marker, tileLayer } from 'leaflet';

import { OSLO_CENTRE } from '@/app/stations/data/location.service';
import type { Position, Station } from '@/app/stations/data/station.model';
import { AVAILABILITY_COLORS, getAvailability } from '@/app/stations/utils/availability';

const DEFAULT_ZOOM = 13;

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
  readonly coveredBottomRatio = input(0);

  private readonly destroyRef = inject(DestroyRef);
  private readonly mapElement = viewChild.required<ElementRef<HTMLDivElement>>('map');
  private readonly map = signal<LeafletMap | null>(null);
  private readonly stationLayer = layerGroup();
  private readonly userLayer = layerGroup();

  constructor() {
    afterNextRender(() => this.createMap());

    effect(() => this.showStations(this.stations()));

    effect(() => {
      const map = this.map();
      const position = this.userPosition();
      if (map && position) {
        this.showUserPosition(map, position);
      }
    });
  }

  private createMap(): void {
    const element = this.mapElement().nativeElement;
    const leafletMap = map(element).setView(OSLO_CENTRE, DEFAULT_ZOOM);

    tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }).addTo(leafletMap);
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

  private showStations(stations: Station[]): void {
    this.stationLayer.clearLayers();

    for (const station of stations) {
      const color = AVAILABILITY_COLORS[getAvailability(station)];
      const icon = divIcon({
        className: `station-marker station-marker--${color}`,
        iconSize: [18, 18],
      });

      marker(station.position, { icon, title: station.name }).addTo(this.stationLayer);
    }
  }

  private showUserPosition(map: LeafletMap, position: Position): void {
    this.userLayer.clearLayers();
    circleMarker(position, { radius: 8, className: 'user-marker' }).addTo(this.userLayer);

    const coveredHeight = map.getSize().y * this.coveredBottomRatio();
    map.fitBounds(latLngBounds([position, position]), {
      paddingBottomRight: [0, coveredHeight],
      maxZoom: DEFAULT_ZOOM,
    });
  }
}
