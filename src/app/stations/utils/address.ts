import type { Station } from '@/app/stations/data/station.model';

export function formatAddress({ address, town }: Pick<Station, 'address' | 'town'>): string {
  return town ? `${address}, ${town}` : address;
}
