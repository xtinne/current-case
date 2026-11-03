import type { Station } from '@/app/stations/data/station.model';

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
export function getAvailability(station: Station): Availability {
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
