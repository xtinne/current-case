import type { Charger, Station } from '@/app/stations/data/station.model';

export type Availability = 'available' | 'full' | 'out-of-order' | 'closed' | 'no-chargers';

// Ionic theme colour names, shared by the list badges and the map markers.
export const AVAILABILITY_COLORS: Record<Availability, string> = {
  available: 'success',
  full: 'warning',
  'out-of-order': 'danger',
  closed: 'medium',
  'no-chargers': 'medium',
};

// The order of the checks matters: closed stations should be checked before available ones.
export function getAvailability(station: Pick<Station, 'isOpen' | 'chargers'>): Availability {
  const { total, available, occupied } = station.chargers;

  if (total === 0) {
    return 'no-chargers';
  }
  if (!station.isOpen) {
    return 'closed';
  }
  if (available > 0) {
    return 'available';
  }
  if (occupied > 0) {
    return 'full';
  }
  return 'out-of-order';
}
export function countChargers(chargers: Charger[]): Station['chargers'] {
  const countWith = (status: Charger['status']): number =>
    chargers.filter((charger) => charger.status === status).length;

  return {
    total: chargers.length,
    available: countWith('available'),
    occupied: countWith('in-use'),
    offline: countWith('out-of-order'),
  };
}
