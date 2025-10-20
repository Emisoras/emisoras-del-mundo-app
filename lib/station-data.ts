
import type { Station } from '@/types';

// The station data is now fetched from Firestore.
// This file is kept for utility functions if needed in the future.
// The hardcoded station array has been removed.
export const stations: Station[] = [];


// --- Utility functions can remain here if they are used elsewhere or for future features ---

export const getFavoriteStations = (allStations: Station[], ids: string[]): Station[] => {
  if (!allStations) return [];
  return allStations.filter(s => s.id && ids.includes(s.id));
};

export const getStationById = (allStations: Station[], id: string): Station | undefined => {
  if (!allStations) return undefined;
  return allStations.find(s => s.id === id);
};
