
"use client";

import type { Station } from '@/types';
import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation'; // Import useRouter
import { Button } from '@/components/ui/button';
import { PlayCircle, PauseCircle, Heart, RadioIcon, Loader2 } from 'lucide-react';
import { useAudioPlayer } from '@/contexts/audio-player-context';
import { useFavorites } from '@/contexts/favorites-context';
import { Card, CardContent } from '@/components/ui/card';

interface StationItemProps {
  station: Station;
}

export default function StationItem({ station }: StationItemProps) {
  const router = useRouter(); // Initialize useRouter
  const { currentStation, isPlaying, isLoading: isAudioLoading, playStation, togglePlayPause } = useAudioPlayer();
  const { favoriteIds, addFavorite, removeFavorite, isFavorite } = useFavorites();

  const isCurrentPlayingStation = currentStation?.id === station.id && isPlaying;
  const isCurrentStationLoading = currentStation?.id === station.id && isAudioLoading;
  const stationIsFavorite = isFavorite(station.id);

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    if (isCurrentPlayingStation) {
      togglePlayPause();
    } else {
      playStation(station);
      router.push('/now-playing'); // Navigate to FullScreenPlayer
    }
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (stationIsFavorite) {
      removeFavorite(station.id);
    } else {
      addFavorite(station.id);
    }
  };

  return (
    <Card 
      className="mb-2 hover:bg-accent/10 transition-colors duration-150 ease-in-out shadow-sm cursor-pointer"
      onClick={() => { // Allow clicking the whole card to play and navigate
        if (!isCurrentPlayingStation) {
          playStation(station);
        }
        router.push('/now-playing');
      }}
    >
      <CardContent className="p-3 flex items-center space-x-3">
        {station.logoUrl ? (
            <Image 
              src={station.logoUrl} 
              alt={station.name} 
              width={48} 
              height={48} 
              className="rounded-md aspect-square object-cover"
              data-ai-hint="radio logo"
            />
          ) : (
            <div className="w-12 h-12 rounded-md bg-muted flex items-center justify-center">
              <RadioIcon className="h-6 w-6 text-muted-foreground" />
            </div>
          )}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-foreground truncate">{station.name}</p>
          <p className="text-xs text-muted-foreground truncate">
            {station.city ? `${station.city}, ` : ''}
            {station.state ? `${station.state}, ` : ''}
            {station.country}
            {station.tags && station.tags.length > 0 ? ` • ${station.tags.join(', ')}` : ''}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" onClick={handleFavoriteClick} aria-label={stationIsFavorite ? "Quitar de favoritos" : "Añadir a favoritos"}>
            <Heart className={`h-5 w-5 ${stationIsFavorite ? 'text-primary fill-current' : 'text-muted-foreground'}`} />
          </Button>
          <Button variant="ghost" size="icon" onClick={handlePlayClick} aria-label={isCurrentPlayingStation ? "Pausar" : "Reproducir"}>
            {isCurrentStationLoading ? (
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            ) : isCurrentPlayingStation ? (
              <PauseCircle className="h-6 w-6 text-primary" />
            ) : (
              <PlayCircle className="h-6 w-6 text-primary" />
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
