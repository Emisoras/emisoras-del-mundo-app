"use client";

import React, { useState, useMemo } from 'react';
import type { Station } from '@/types';
import { stations as allStations } from '@/lib/station-data'; // Renamed to avoid conflict
import StationItem from '@/components/station/station-item';
import { Search } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import ImageSlider from '@/components/layout/image-slider'; // Import ImageSlider

// Define adImages here or pass as props if they vary
const adImages = [
  { src: "https://i.imgur.com/g2ytUjl.png", alt: "Anuncio 1", dataAiHint: "advertisement banner" },
  { src: "https://i.imgur.com/evO6XUa.png", alt: "Anuncio 2", dataAiHint: "banner ad" },
  { src: "https://i.imgur.com/SEYv4V9.png", alt: "Anuncio 3", dataAiHint: "advertisement" },
  { src: "https://i.imgur.com/Lu90kzG.png", alt: "Anuncio 4", dataAiHint: "promotion item" },
  { src: "https://i.imgur.com/IQIVY9U.png", alt: "Anuncio 5", dataAiHint: "banner ad" },
  { src: "https://i.imgur.com/sXxc0Rf.png", alt: "Anuncio 6", dataAiHint: "banner ad" },
  { src: "https://i.imgur.com/MjZflf3.png", alt: "Anuncio 7", dataAiHint: "banner ad" },
  { src: "https://i.imgur.com/FnnP7zB.png", alt: "Anuncio 8", dataAiHint: "banner ad" },
  { src: "https://i.imgur.com/BgAbxhE.png", alt: "Anuncio 9", dataAiHint: "banner ad" },
];

export default function BrowseView() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredStations = useMemo(() => {
    if (!searchTerm) {
      return allStations;
    }
    return allStations.filter(station =>
      station.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (station.city && station.city.toLowerCase().includes(searchTerm.toLowerCase())) ||
      station.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (station.state && station.state.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [searchTerm]);

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
        {filteredStations.length > 0 ? (
          filteredStations.map(station => <StationItem key={station.id} station={station} />)
        ) : (
          <p className="text-center text-muted-foreground py-8">No se encontraron emisoras.</p>
        )}
      </ScrollArea>
      
      <div className="mt-auto pt-4 mb-2"> {/* Slider container */}
        <ImageSlider images={adImages} />
      </div>
    </div>
  );
}
