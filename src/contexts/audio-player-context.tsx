
"use client";

import type { Station } from '@/types';
import type { Dispatch, ReactNode, SetStateAction } from 'react';
import React, { createContext, useContext, useState, useRef, useCallback, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";

interface AudioPlayerContextType {
  currentStation: Station | null;
  isPlaying: boolean;
  isLoading: boolean;
  playStation: (station: Station) => void;
  togglePlayPause: () => void;
  audioRef: React.RefObject<HTMLAudioElement>;
  volume: number;
  setVolume: Dispatch<SetStateAction<number>>;
  duration: number;
  currentTime: number;
  seek: (time: number) => void;
  songTitle: string | null;
  songImageUrl: string | null;
}

const AudioPlayerContext = createContext<AudioPlayerContextType | undefined>(undefined);

export const AudioPlayerProvider = ({ children }: { children: ReactNode }) => {
  const [currentStation, setCurrentStation] = useState<Station | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [volume, setVolume] = useState(1);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { toast } = useToast();

  const [songTitle, setSongTitle] = useState<string | null>(null);
  const [songImageUrl, setSongImageUrl] = useState<string | null>(null);
  const metadataIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const clearMetadataInterval = useCallback(() => {
    if (metadataIntervalRef.current) {
      clearInterval(metadataIntervalRef.current);
      metadataIntervalRef.current = null;
    }
  }, []);

  const fetchAndSetMetadata = useCallback(async (zenoStreamId: string, stationName: string, stationLogo?: string) => {
    try {
      const response = await fetch(`https://proxy.zeno.fm/api/zeno/nowplaying/${zenoStreamId}`);
      if (!response.ok) {
        // console.warn(`Failed to fetch metadata for ${zenoStreamId}`);
        setSongTitle(stationName || "En vivo");
        setSongImageUrl(stationLogo || null);
        return;
      }
      const data = await response.json();
      if (data.title && data.title.trim() !== "") {
        setSongTitle(data.title);
      } else {
        setSongTitle(stationName || "En vivo");
      }
      // Use Zeno image if available, otherwise fallback to station logo
      setSongImageUrl(data.image_url || stationLogo || null);

    } catch (error) {
      // console.error("Error fetching metadata:", error);
      setSongTitle(stationName || "En vivo");
      setSongImageUrl(stationLogo || null);
    }
  }, []);


  const playStation = useCallback((station: Station) => {
    clearMetadataInterval();
    setSongTitle(station.name);
    setSongImageUrl(station.logoUrl || null);
    setCurrentStation(station); // Set currentStation before fetching metadata

    if (audioRef.current) {
      setIsLoading(true);
      audioRef.current.src = station.streamUrl;
      audioRef.current.load();
      audioRef.current.play().then(() => {
        setIsPlaying(true);
        setIsLoading(false);

        const zenoMatch = station.streamUrl.match(/zeno\.fm\/([a-zA-Z0-9\-_]+)/);
        if (zenoMatch && zenoMatch[1]) {
          const zenoStreamId = zenoMatch[1];
          fetchAndSetMetadata(zenoStreamId, station.name, station.logoUrl);
          metadataIntervalRef.current = setInterval(() => {
            fetchAndSetMetadata(zenoStreamId, station.name, station.logoUrl);
          }, 20000);
        }
      }).catch(error => {
        console.error(`Error playing station ${station.name} (URL: ${station.streamUrl}):`, error);
        if (typeof window !== 'undefined' && window.location.protocol === 'https:' && station.streamUrl.startsWith('http:')) {
          console.warn("This might be a mixed content issue. The application is served over HTTPS, but the stream URL is HTTP. Browsers typically block this for security reasons.");
        }
        toast({
          title: "Error de reproducción",
          description: `No se pudo reproducir ${station.name}. Verifique la URL o intente más tarde.`,
          variant: "destructive",
        });
        setIsPlaying(false);
        setIsLoading(false);
        setCurrentStation(null);
        setSongTitle(null);
        setSongImageUrl(null);
      });
    }
  }, [clearMetadataInterval, fetchAndSetMetadata, toast]);

  const togglePlayPause = useCallback(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
        clearMetadataInterval();
      } else if (currentStation) {
        setIsLoading(true);
        audioRef.current.play().then(() => {
          setIsPlaying(true);
          setIsLoading(false);
          // Resume metadata polling if it's a Zeno stream
          const zenoMatch = currentStation.streamUrl.match(/zeno\.fm\/([a-zA-Z0-9\-_]+)/);
          if (zenoMatch && zenoMatch[1]) {
            const zenoStreamId = zenoMatch[1];
            fetchAndSetMetadata(zenoStreamId, currentStation.name, currentStation.logoUrl);
            metadataIntervalRef.current = setInterval(() => {
                fetchAndSetMetadata(zenoStreamId, currentStation.name, currentStation.logoUrl);
            }, 20000);
          }
        }).catch(error => {
          console.error("Error resuming playback:", error);
           toast({
            title: "Error de reproducción",
            description: `No se pudo reanudar ${currentStation.name}.`,
            variant: "destructive",
          });
          setIsPlaying(false);
          setIsLoading(false);
        });
      }
    }
  }, [isPlaying, currentStation, clearMetadataInterval, fetchAndSetMetadata, toast]);

  const seek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = volume;
      const handleLoadedMetadataEvent = () => setDuration(audio.duration);
      const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
      const handleCanPlay = () => {
        setIsLoading(false);
        if (currentStation && audio.paused && isPlaying) {
             audio.play().catch(e => console.warn("Autoplay after canplay prevented:", e));
        }
      };
      const handleWaiting = () => setIsLoading(true);
      const handlePlaying = () => {
          setIsPlaying(true);
          setIsLoading(false);
      };
      const handlePause = () => {
        // setIsPlaying(false); // This is handled by togglePlayPause or when audio element pauses itself
      };
      const handleEnded = () => {
        setIsPlaying(false);
        clearMetadataInterval();
      };
      const handleError = () => {
        setIsLoading(false);
        setIsPlaying(false);
        clearMetadataInterval();
        if(currentStation) {
          toast({
            title: "Error de Stream",
            description: `Problema con la emisora ${currentStation.name}.`,
            variant: "destructive",
          });
        }
      };

      audio.addEventListener('loadedmetadata', handleLoadedMetadataEvent);
      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.addEventListener('canplay', handleCanPlay);
      audio.addEventListener('waiting', handleWaiting);
      audio.addEventListener('playing', handlePlaying);
      audio.addEventListener('pause', handlePause);
      audio.addEventListener('ended', handleEnded);
      audio.addEventListener('error', handleError);

      return () => {
        audio.removeEventListener('loadedmetadata', handleLoadedMetadataEvent);
        audio.removeEventListener('timeupdate', handleTimeUpdate);
        audio.removeEventListener('canplay', handleCanPlay);
        audio.removeEventListener('waiting', handleWaiting);
        audio.removeEventListener('playing', handlePlaying);
        audio.removeEventListener('pause', handlePause);
        audio.removeEventListener('ended', handleEnded);
        audio.removeEventListener('error', handleError);
        clearMetadataInterval(); // Cleanup on unmount
      };
    }
  }, [volume, currentStation, isPlaying, toast, clearMetadataInterval, fetchAndSetMetadata]);


  return (
    <AudioPlayerContext.Provider value={{
      currentStation,
      isPlaying,
      isLoading,
      playStation,
      togglePlayPause,
      audioRef,
      volume,
      setVolume,
      duration,
      currentTime,
      seek,
      songTitle,
      songImageUrl
    }}>
      {children}
      <audio ref={audioRef} crossOrigin="anonymous"/>
    </AudioPlayerContext.Provider>
  );
};

export const useAudioPlayer = () => {
  const context = useContext(AudioPlayerContext);
  if (context === undefined) {
    throw new Error('useAudioPlayer must be used within an AudioPlayerProvider');
  }
  return context;
};

