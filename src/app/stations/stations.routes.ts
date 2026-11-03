import type { Routes } from '@angular/router';

export const STATIONS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/station-map/station-map.page').then((m) => m.StationMapPage),
  },
];
