"use client";

import type { Station } from '@/types';
import type { ReactNode, Dispatch, SetStateAction } from 'react';
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface FavoritesContextType {
  favoriteIds: string[];
  addFavorite: (stationId: string) => void;
  removeFavorite: (stationId: string) => void;
  isFavorite: (stationId: string) => boolean;
  setFavoriteIds: Dispatch<SetStateAction<string[]>>; // Exposed for advanced use if needed
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'emisorasDelMundo_favorites';

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const storedFavorites = localStorage.getItem(LOCAL_STORAGE_KEY);
      return storedFavorites ? JSON.parse(storedFavorites) : [];
    }
    return [];
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(favoriteIds));
    }
  }, [favoriteIds]);

  const addFavorite = useCallback((stationId: string) => {
    setFavoriteIds(prevIds => {
      if (!prevIds.includes(stationId)) {
        return [...prevIds, stationId];
      }
      return prevIds;
    });
  }, []);

  const removeFavorite = useCallback((stationId: string) => {
    setFavoriteIds(prevIds => prevIds.filter(id => id !== stationId));
  }, []);

  const isFavorite = useCallback((stationId: string) => {
    return favoriteIds.includes(stationId);
  }, [favoriteIds]);

  return (
    <FavoritesContext.Provider value={{ favoriteIds, addFavorite, removeFavorite, isFavorite, setFavoriteIds }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};
