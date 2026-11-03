import type { StationAccess } from '@/app/stations/data/station.model';

export const ACCESS_LABELS: Record<StationAccess, string | null> = {
  public: null,
  apartment: 'Residents only',
  private: 'Private',
};
