"use client";

import type { Station } from '@/types';
import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { PlayCircle, PauseCircle, Heart, RadioIcon, Loader2 } from 'lucide-react';
import { useAudioPlayer } from '@/contexts/audio-player-context';
import { useFavorites } from '@/contexts/favorites-context';
import { Card, CardContent } from '@/components/ui/card';

interface StationItemProps {
  station: Station;
}

export default function StationItem({ station }: StationItemProps) {
  const router = useRouter();
  const { currentStation, isPlaying, isLoading: isAudioLoading, playStation, togglePlayPause } = useAudioPlayer();
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();

  const isCurrentPlayingStation = currentStation?.id === station.id && isPlaying;
  const isCurrentStationLoading = currentStation?.id === station.id && isAudioLoading;
  const stationIsFavorite = isFavorite(station.id);

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    if (isCurrentPlayingStation) {
      togglePlayPause();
    } else {
      playStation(station);
      router.push('/now-playing');
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
      onClick={() => {
        if (!isCurrentPlayingStation) {
          playStation(station);
        }
        router.push('/now-playing');
      }}
    >
      <CardContent className="p-2 flex items-center gap-1">
        {/* Logo */}
        <div className="flex-shrink-0">
          {station.logoUrl ? (
              <Image 
                src={station.logoUrl} 
                alt={station.name} 
                width={40}
                height={40}
                className="w-10 h-10 rounded-md aspect-square object-cover"
                data-ai-hint="radio logo"
              />
            ) : (
              <div className="w-10 h-10 rounded-md bg-muted flex items-center justify-center">
                <RadioIcon className="h-5 w-5 text-muted-foreground" />
              </div>
            )}
        </div>

        {/* Text Info */}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-foreground truncate text-sm">{station.name}</p>
          <p className="text-xs text-muted-foreground truncate">
            {station.city ? `${station.city}, ` : ''}
            {station.state ? `${station.state}, ` : ''}
            {station.country}
            {station.tags && station.tags.length > 0 ? ` • ${station.tags.join(', ')}` : ''}
          </p>
        </div>
        
        {/* Action Buttons */}
        <div className="flex items-center flex-shrink-0">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleFavoriteClick} aria-label={stationIsFavorite ? "Quitar de favoritos" : "Añadir a favoritos"}>
            <Heart className={`h-4 w-4 ${stationIsFavorite ? 'text-primary fill-current' : 'text-muted-foreground'}`} />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handlePlayClick} aria-label={isCurrentPlayingStation ? "Pausar" : "Reproducir"}>
            {isCurrentStationLoading ? (
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
            ) : isCurrentPlayingStation ? (
              <PauseCircle className="h-5 w-5 text-primary" />
            ) : (
              <PlayCircle className="h-5 w-5 text-primary" />
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}