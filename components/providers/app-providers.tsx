"use client";

import type { ReactNode } from 'react';
import { AudioPlayerProvider } from '@/contexts/audio-player-context';
import { FavoritesProvider } from '@/contexts/favorites-context';
import { FirebaseClientProvider } from '@/firebase/client-provider';

export default function AppProviders({ children }: { children: ReactNode }) {
  return (
    <FirebaseClientProvider>
      <AudioPlayerProvider>
        <FavoritesProvider>
          {children}
        </FavoritesProvider>
      </AudioPlayerProvider>
    </FirebaseClientProvider>
  );
}
