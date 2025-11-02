
"use client";

import React, { useState, useMemo, useEffect } from 'react';
import type { Station } from '@/types';
import { useFirestore, useCollection } from '@/firebase';
import type { WithId } from '@/firebase/firestore/use-collection';
import { collection, query, orderBy } from 'firebase/firestore';
import StationItem from '@/components/station/station-item';
import { Search, Loader2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';

export default function BrowseView() {
  const [searchTerm, setSearchTerm] = useState('');
  const firestore = useFirestore();

  const stationsQuery = useMemo(() => {
    return query(collection(firestore, 'stations'), orderBy('order'));
  }, [firestore]);

  const { data: allStations, loading, error } = useCollection<WithId<Station>>(stationsQuery);
  
  const filteredStations = useMemo(() => {
    if (!allStations) return [];
    if (!searchTerm) {
      return allStations;
    }
    return allStations.filter(station =>
      station.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (station.city && station.city.toLowerCase().includes(searchTerm.toLowerCase())) ||
      station.country.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, allStations]);
  
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center mb-4 gap-2">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Buscar emisora..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full"
          />
        </div>
      </div>

      <p className="text-sm font-semibold mb-3 text-foreground">Todas las Emisoras</p>

      <ScrollArea className="flex-grow pr-1">
        {loading && (
            <div className="flex justify-center items-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )}
        {error && (
            <p className="text-center text-destructive py-8">Error al cargar emisoras: {error.message}</p>
        )}
        {!loading && !error && filteredStations.length > 0 ? (
          filteredStations.map((station, index) => <StationItem key={station.id || index} station={station} />)
        ) : (
          !loading && !error && <p className="text-center text-muted-foreground py-8">No se encontraron emisoras.</p>
        )}
      </ScrollArea>
    </div>
  );
}
