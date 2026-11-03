import type { Routes } from '@angular/router';

export const STATIONS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/stations/stations.page').then((m) => m.StationsPage),
  },
];
