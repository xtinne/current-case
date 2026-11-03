import type { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'stations',
    loadChildren: () => import('./stations/stations.routes').then((m) => m.STATIONS_ROUTES),
  },
  {
    path: '',
    redirectTo: 'stations',
    pathMatch: 'full',
  },
];
