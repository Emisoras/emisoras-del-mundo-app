
"use client";

import React from 'react';
import Link from 'next/link';
import { useAudioPlayer } from '@/contexts/audio-player-context';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { PlayCircle, PauseCircle, Loader2, RadioIcon, Maximize2 } from 'lucide-react'; // Removed Volume icons
import Image from 'next/image';

export default function BottomPlayer() {
  const { 
    currentStation, 
    isPlaying, 
    isLoading, 
    togglePlayPause, 
    // volume, // volume and setVolume are no longer needed here
    // setVolume,
    duration,
    currentTime,
    seek
  } = useAudioPlayer();

  if (!currentStation) {
    return null;
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };
  
  const isLiveStream = duration === Infinity || duration === 0;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-card p-3 shadow-md">
      <div className="container mx-auto flex items-center justify-between gap-4">
        <Link href="/now-playing" className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer hover:opacity-80 transition-opacity">
          {currentStation.logoUrl ? (
            <Image 
              src={currentStation.logoUrl} 
              alt={currentStation.name} 
              width={40} 
              height={40} 
              className="rounded aspect-square object-cover"
              data-ai-hint="radio logo"
            />
          ) : (
            <RadioIcon className="h-10 w-10 text-muted-foreground" />
          )}
          <div className="truncate">
            <p className="text-sm font-semibold truncate text-foreground">{currentStation.name}</p>
            <p className="text-xs text-muted-foreground truncate">{currentStation.city || currentStation.state || currentStation.country}</p>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={togglePlayPause} aria-label={isPlaying ? "Pausar" : "Reproducir"}>
            {isLoading ? (
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            ) : isPlaying ? (
              <PauseCircle className="h-6 w-6 text-primary" />
            ) : (
              <PlayCircle className="h-6 w-6 text-primary" />
            )}
          </Button>
          <Link href="/now-playing">
            <Button variant="ghost" size="icon" aria-label="Abrir reproductor">
              <Maximize2 className="h-5 w-5" />
            </Button>
          </Link>
        </div>
        
        {/* Volume control removed from here */}
        {/* <div className="hidden md:flex items-center gap-2 w-1/4">
          <Button variant="ghost" size="icon" onClick={() => setVolume(v => v > 0 ? 0 : 1)} aria-label={volume > 0 ? "Silenciar" : "Activar sonido"}>
            {volume > 0 ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
          </Button>
          <Slider
            defaultValue={[volume]}
            max={1}
            step={0.01}
            onValueChange={(value) => setVolume(value[0])}
            className="w-full"
            aria-label="Volumen"
          />
        </div> */}
      </div>
      {!isLiveStream && (
         <div className="mt-1 px-4 flex items-center gap-2">
            <span className="text-xs text-muted-foreground">{formatTime(currentTime)}</span>
            <Slider
              value={[currentTime]}
              max={duration}
              step={1}
              onValueChange={(value) => seek(value[0])}
              className="w-full"
              aria-label="Progreso de la reproducción"
            />
            <span className="text-xs text-muted-foreground">{formatTime(duration)}</span>
          </div>
      )}
    </div>
  );
}
