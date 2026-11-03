import type { Station } from '@/app/stations/data/station.model';

export type Availability = 'available' | 'full' | 'out-of-order' | 'closed' | 'no-chargers';

// The order of the checks matters: a closed station can still report free chargers.
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
