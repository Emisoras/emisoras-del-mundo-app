
"use client";

import React, { useMemo, useEffect, useState } from 'react';
import { useFavorites } from '@/contexts/favorites-context';
import { getFavoriteStations } from '@/lib/station-data';
import StationItem from '@/components/station/station-item';
import { ScrollArea } from '@/components/ui/scroll-area';
import { HeartOff, Loader2 } from 'lucide-react';
import { useFirestore, useCollection } from '@/firebase';
import type { WithId } from '@/firebase/firestore/use-collection';
import { collection } from 'firebase/firestore';
import type { Station } from '@/types';

// --- FAVORITES VIEW COMPONENT ---
export default function FavoritesView() {
  const { favoriteIds } = useFavorites();
  const firestore = useFirestore();
  const stationsQuery = useMemo(() => collection(firestore, 'stations'), [firestore]);
  const { data: allStations, loading, error } = useCollection<WithId<Station>>(stationsQuery);

  const favoriteStations = useMemo(() => {
    if (!allStations) return [];
    return getFavoriteStations(allStations, favoriteIds);
  }, [favoriteIds, allStations]);

  return (
    <div className="h-full flex flex-col">
      <p className="text-sm font-semibold mb-3 text-foreground">Mis Emisoras Favoritas</p>
      <ScrollArea className="flex-grow pr-1">
        {loading && (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}
        {!loading && error && (
          <p className="text-center text-destructive py-8">Error: {error.message}</p>
        )}
        {!loading && !error && favoriteStations.length === 0 && (
           <div className="flex flex-col items-center justify-center h-full text-center py-10">
              <HeartOff className="h-16 w-16 text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold mb-2">No tienes favoritos</h2>
              <p className="text-muted-foreground">Añade emisoras a tus favoritos para verlas aquí.</p>
           </div>
        )}
         {!loading && !error && favoriteStations.length > 0 && (
            favoriteStations.map(station => (
              <StationItem key={station.id} station={station} />
            ))
         )}
      </ScrollArea>
    </div>
  );
}
