
"use client";

import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAudioPlayer } from '@/contexts/audio-player-context';
import { useFavorites } from '@/contexts/favorites-context';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import {
  ArrowLeft,
  Heart,
  Play,
  Pause,
  Share2,
  Volume2,
  VolumeX,
  RadioIcon,
  Loader2,
  Instagram,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import type { Station } from '@/types';

const WhatsAppIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
  </svg>
);

const MailIcon = () => (
  // Using a placeholder Mail icon from lucide for consistency, you can replace this SVG
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="16" x="2" y="4" rx="2"/>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
);


interface AudioVisualizerProps {
  isPlaying: boolean;
}

const AudioVisualizer = ({ isPlaying }: AudioVisualizerProps) => {
  const barCount = 20;
  const initialHeights = React.useMemo(() => Array.from({ length: barCount }, () => 10), [barCount]);
  const [barHeights, setBarHeights] = useState<number[]>(initialHeights);
  const animationFrameId = useRef<number | null>(null);
  const lastUpdateTime = useRef(0);
  const interval = 150; // ms, speed of animation

  useEffect(() => {
    const animate = (timestamp: number) => {
      if (isPlaying) {
        if (timestamp - lastUpdateTime.current > interval) {
          const newHeights = Array.from(
            { length: barCount },
            () => Math.random() * 50 + 10
          );
          setBarHeights(newHeights);
          lastUpdateTime.current = timestamp;
        }
        animationFrameId.current = requestAnimationFrame(animate);
      } else {
        if (barHeights !== initialHeights) {
          setBarHeights(initialHeights);
        }
      }
    };

    if (isPlaying) {
      lastUpdateTime.current = performance.now();
      animationFrameId.current = requestAnimationFrame(animate);
    } else {
       if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      setBarHeights(initialHeights);
    }

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying, barCount]);

  return (
    <div className="flex items-end justify-between h-16 w-full px-2">
      {barHeights.map((height, index) => (
        <div
          key={index}
          className="bg-primary rounded-sm transition-all duration-100 ease-linear"
          style={{ height: `${height}px`, width: `${100 / (barCount * 1.5)}%` }}
        />
      ))}
    </div>
  );
};

export default function FullScreenPlayer() {
  const router = useRouter();
  const {
    currentStation,
    isPlaying,
    isLoading,
    togglePlayPause,
    volume,
    setVolume,
    duration,
    currentTime,
    seek,
    songTitle,
    songImageUrl,
  } = useAudioPlayer();
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const [localIsFavorite, setLocalIsFavorite] = useState(false);

  useEffect(() => {
    if (currentStation) {
      setLocalIsFavorite(isFavorite(currentStation.id));
    }
  }, [currentStation, isFavorite]);


  if (!currentStation) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Cargando información de la emisora...</p>
        <Button variant="outline" onClick={() => router.push('/')} className="mt-6">
          Volver al inicio
        </Button>
      </div>
    );
  }

  const stationIsFavorite = isFavorite(currentStation.id);

  const handleFavoriteClick = () => {
    if (stationIsFavorite) {
      removeFavorite(currentStation.id);
    } else {
      addFavorite(currentStation.id);
    }
    setLocalIsFavorite(!stationIsFavorite);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  const isLiveStream = duration === Infinity || duration === 0 || isNaN(duration);

  const displayImageUrl = songImageUrl || currentStation.logoUrl;
  const displaySongTitle = songTitle || currentStation.name;
  const displayTags = currentStation.tags?.join(', ') || 'Música Variada';


  const handleSocialLink = (url?: string) => {
    if (url) {
      if (url.startsWith("mailto:") || url.includes("@")) {
         window.location.href = url.startsWith("mailto:") ? url : `mailto:${url}`;
      } else {
        window.open(url, '_blank', 'noopener,noreferrer');
      }
    }
  };


  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <div className="flex items-center p-4">
        <Button variant="ghost" size="icon" onClick={() => router.push('/')}>
          <ArrowLeft className="h-6 w-6" />
        </Button>
      </div>

      <div className="flex flex-col items-center justify-center text-center px-4 mt-2 mb-6">
        {displayImageUrl ? (
          <Image
            src={displayImageUrl}
            alt={currentStation.name}
            width={192}
            height={192}
            className="w-40 h-40 md:w-48 md:h-48 rounded-lg shadow-lg aspect-square object-cover mb-6"
            data-ai-hint="radio logo album art"
            key={displayImageUrl} // Added key to force re-render on image change
          />
        ) : (
          <div className="w-40 h-40 md:w-48 md:h-48 rounded-lg shadow-lg bg-muted flex items-center justify-center mb-6">
            <RadioIcon className="h-20 w-20 text-muted-foreground" />
          </div>
        )}
        <h1 className="text-2xl font-bold">{currentStation.name}</h1>
        <p className="text-muted-foreground text-sm">
          {currentStation.city || currentStation.state || currentStation.country}
          {` • ${displayTags}`}
        </p>
      </div>

      <Card className="mx-4 mb-6 bg-card/80 shadow-md">
        <CardContent className="p-4 text-center">
          <p className="text-xs text-muted-foreground mb-1">Reproduciendo ahora</p>
          <h2 className="text-lg font-semibold truncate">{displaySongTitle}</h2>
        </CardContent>
      </Card>

      <div className="px-4 mb-2">
        <AudioVisualizer isPlaying={isPlaying && !isLoading} />
      </div>

      <div className="px-6 mb-6 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => setVolume(v => v > 0 ? 0 : 0.01)} aria-label={volume > 0 ? "Silenciar" : "Activar sonido"}>
            {volume > 0 ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
        </Button>
        <Slider
            value={[volume]}
            max={1}
            step={0.01}
            onValueChange={(value) => setVolume(value[0])}
            className="w-full"
            aria-label="Volumen"
        />
      </div>

      {!isLiveStream && (
        <div className="px-6 mb-6 flex items-center gap-3">
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
      {isLiveStream && <div className="h-[52px] mb-0"></div>}


      <div className="flex justify-center items-center gap-4 mb-8 px-4">
        {currentStation.whatsappUrl && (
          <Button variant="ghost" size="icon" className="rounded-full w-10 h-10 md:w-12 md:h-12 bg-green-500 hover:bg-green-600 text-white" onClick={() => handleSocialLink(currentStation.whatsappUrl)}>
            <WhatsAppIcon />
          </Button>
        )}
        {currentStation.instagramUrl && (
          <Button variant="ghost" size="icon" className="rounded-full w-10 h-10 md:w-12 md:h-12 bg-pink-500 hover:bg-pink-600 text-white" onClick={() => handleSocialLink(currentStation.instagramUrl)}>
            <Instagram className="h-6 w-6" />
          </Button>
        )}
        {currentStation.email && (
          <Button variant="ghost" size="icon" className="rounded-full w-10 h-10 md:w-12 md:h-12 bg-yellow-500 hover:bg-yellow-600 text-white" onClick={() => handleSocialLink(`mailto:${currentStation.email}`)}>
            <MailIcon />
          </Button>
        )}
      </div>

      <div className="flex items-center justify-around p-4 mt-auto border-t border-border/20">
        <Button variant="ghost" size="icon" onClick={handleFavoriteClick} className="w-12 h-12 md:w-14 md:h-14">
          <Heart className={`h-6 w-6 md:h-7 md:w-7 ${localIsFavorite ? 'text-primary fill-current' : 'text-muted-foreground'}`} />
        </Button>
        <Button
          variant="default"
          size="icon"
          onClick={togglePlayPause}
          className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-primary hover:bg-primary/90 shadow-lg"
          aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
        >
          {isLoading ? (
            <Loader2 className="h-8 w-8 md:h-10 md:h-10 animate-spin" />
          ) : isPlaying ? (
            <Pause className="h-8 w-8 md:h-10 md:h-10" />
          ) : (
            <Play className="h-8 w-8 md:h-10 md:h-10" />
          )}
        </Button>
        <Button variant="ghost" size="icon" className="w-12 h-12 md:w-14 md:h-14" onClick={() => navigator.share && navigator.share({ title: currentStation.name, text: `Escuchando ${currentStation.name}`, url: window.location.href })}>
          <Share2 className="h-6 w-6 md:h-7 md:h-7 text-muted-foreground" />
        </Button>
      </div>
    </div>
  );
}
