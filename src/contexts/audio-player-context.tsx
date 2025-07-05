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
  const metadataIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  const updateTitle = useCallback((title: string | undefined | null, stationName: string) => {
      const trimmedTitle = title?.trim();
      if (trimmedTitle && trimmedTitle.toLowerCase() !== stationName.toLowerCase() && trimmedTitle !== '-' && trimmedTitle.length > 1) {
          setSongTitle(trimmedTitle);
      } else {
          setSongTitle(stationName);
      }
  }, []);

  const closeMetadataSources = useCallback(() => {
    if (metadataIntervalRef.current) {
      clearInterval(metadataIntervalRef.current);
      metadataIntervalRef.current = null;
    }
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
  }, []);

  const fetchMetadata = useCallback(async (station: Station) => {
    const getTitleFromJson = (data: any): string | null => {
        if (!data) return null;
        // AzuraCast (voicevoz)
        if (data.now_playing?.song?.text) return data.now_playing.song.text;
        // Dribbcast
        if (data.song) return data.song;
        // Shoutcast v2 (Ocaña Stereo, Radio Catatumbo)
        if (data.songtitle) return data.songtitle;
        // Icecast (La UFM Estereo)
        if (data.icestats?.source?.title) return data.icestats.source.title;
        // Another common Icecast format (if source is an array)
        if (Array.isArray(data.icestats?.source) && data.icestats.source[0]?.title) return data.icestats.source[0].title;
        
        return null;
    }

    // --- Strategy 1: Direct fetch from metadataUrl if provided ---
    if (station.metadataUrl) {
        try {
            const signal = AbortSignal.timeout(8000);
            const response = await fetch(station.metadataUrl, { signal, cache: 'no-store' });
            if (!response.ok) throw new Error(`Direct metadata fetch failed with status ${response.status}`);
            
            const data = await response.json();
            const title = getTitleFromJson(data);
            
            if (title) {
                updateTitle(title, station.name);
                return; // Success! No need to continue.
            }
            console.warn(`Could not parse title from direct metadataUrl for ${station.name}`, data);
        } catch (error) {
            console.warn(`Direct metadata fetch failed for ${station.name}:`, error);
        }
    }

    // --- Strategy 2: Use the voicevoz proxy as a fallback ---
    try {
        const proxyUrl = `https://voicevoz.com/api.php?url=${encodeURIComponent(station.streamUrl)}`;
        const signal = AbortSignal.timeout(8000);
        const response = await fetch(proxyUrl, { signal });
        if (!response.ok) throw new Error('Proxy request failed');
        
        const data = await response.json();
        const title = getTitleFromJson(data) || data.title;
        updateTitle(title, station.name);
    } catch (error) {
        console.warn(`Could not fetch metadata for ${station.name} via proxy either. Falling back to station name.`, error);
        updateTitle(station.name, station.name); // Final fallback
    }
  }, [updateTitle]);


  const subscribeToMetadata = useCallback((station: Station) => {
    closeMetadataSources();

    if (station.streamUrl.includes('zeno.fm/')) {
        const streamId = station.streamUrl.split('/').pop();
        if (streamId) {
            const eventSourceUrl = `https://api.zeno.fm/mounts/metadata/subscribe/${streamId}`;
            const es = new EventSource(eventSourceUrl);
            
            es.onmessage = (event) => {
                try {
                    const parsedData = JSON.parse(event.data);
                    if (parsedData.streamTitle) {
                        updateTitle(parsedData.streamTitle, station.name);
                    }
                } catch(e) {
                     console.error('Error parsing Zeno metadata', e);
                     updateTitle(station.name, station.name);
                }
            };

            es.onerror = () => {
                console.warn(`EventSource error for ${station.name}. Closing connection.`);
                es.close();
                updateTitle(station.name, station.name);
            };
            
            eventSourceRef.current = es;
            return;
        }
    }
    
    // For all other station types, use the improved fetch method.
    fetchMetadata(station);
    metadataIntervalRef.current = setInterval(() => fetchMetadata(station), 15000);

  }, [closeMetadataSources, fetchMetadata, updateTitle]);

  const playStation = useCallback((station: Station) => {
    closeMetadataSources();
    setCurrentStation(station);
    setSongTitle(station.name);

    if (audioRef.current) {
      setIsLoading(true);
      audioRef.current.src = station.streamUrl;
      audioRef.current.load();
      audioRef.current.play().then(() => {
        setIsPlaying(true);
        setIsLoading(false);
        subscribeToMetadata(station);
      }).catch(error => {
        console.error(`Error playing station ${station.name} (URL: ${station.streamUrl}):`, error);
        toast({
          title: "Error de reproducción",
          description: `No se pudo reproducir ${station.name}.`,
          variant: "destructive",
        });
        setIsPlaying(false);
        setIsLoading(false);
        setCurrentStation(null);
        setSongTitle(null);
        closeMetadataSources();
      });
    }
  }, [closeMetadataSources, subscribeToMetadata, toast]);

  const togglePlayPause = useCallback(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
        closeMetadataSources();
      } else if (currentStation) {
        setIsLoading(true);
        audioRef.current.play().then(() => {
          setIsPlaying(true);
          setIsLoading(false);
          subscribeToMetadata(currentStation);
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
  }, [isPlaying, currentStation, closeMetadataSources, subscribeToMetadata, toast]);

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
      const handleCanPlay = () => setIsLoading(false);
      const handleWaiting = () => setIsLoading(true);
      const handlePlaying = () => {
          setIsPlaying(true);
          setIsLoading(false);
      };
      const handleEnded = () => {
        setIsPlaying(false);
        closeMetadataSources();
      };
      const handleError = (e: Event) => {
        setIsLoading(false);
        setIsPlaying(false);
        closeMetadataSources();
        if(currentStation) {
          toast({
            title: `Error en ${currentStation.name}`,
            description: "Problema con la emisora. Puede que no esté disponible.",
            variant: "destructive",
          });
        }
      };

      audio.addEventListener('loadedmetadata', handleLoadedMetadataEvent);
      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.addEventListener('canplay', handleCanPlay);
      audio.addEventListener('waiting', handleWaiting);
      audio.addEventListener('playing', handlePlaying);
      audio.addEventListener('ended', handleEnded);
      audio.addEventListener('error', handleError);

      return () => {
        audio.removeEventListener('loadedmetadata', handleLoadedMetadataEvent);
        audio.removeEventListener('timeupdate', handleTimeUpdate);
        audio.removeEventListener('canplay', handleCanPlay);
        audio.removeEventListener('waiting', handleWaiting);
        audio.removeEventListener('playing', handlePlaying);
        audio.removeEventListener('ended', handleEnded);
        audio.removeEventListener('error', handleError);
        closeMetadataSources();
      };
    }
  }, [volume, currentStation, toast, closeMetadataSources]);


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
      songTitle
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
