// @ts-nocheck
"use client";

import React, { useMemo } from 'react';
import { useFavorites } from '@/contexts/favorites-context';
import { getFavoriteStations } from '@/lib/station-data';
import StationItem from '@/components/station/station-item';
import { ScrollArea } from '@/components/ui/scroll-area';
import { HeartOff } from 'lucide-react';

export default function FavoritesView() {
  const { favoriteIds } = useFavorites();
  const favoriteStations = useMemo(() => getFavoriteStations(favoriteIds), [favoriteIds]);

  if (favoriteStations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center py-10">
        <HeartOff className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold mb-2">No tienes favoritos</h2>
        <p className="text-muted-foreground">Añade emisoras a tus favoritos para verlas aquí.</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <p className="text-sm font-semibold mb-3 text-foreground">Mis Emisoras Favoritas</p>
      <ScrollArea className="flex-grow pr-1">
        {favoriteStations.map(station => (
          <StationItem key={station.id} station={station} />
        ))}
      </ScrollArea>
    </div>
  );
}
