
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import SplashScreen from '@/components/layout/splash-screen';

const SPLASH_SESSION_KEY = 'splash_screen_shown';

export default function SplashGate({ children }: { children: React.ReactNode }) {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Check session storage to see if splash has been shown in this session
    if (sessionStorage.getItem(SPLASH_SESSION_KEY)) {
      setShowSplash(false);
    } else {
        // If not shown, set the flag in session storage so it doesn't show again on navigation
        sessionStorage.setItem(SPLASH_SESSION_KEY, 'true');
    }
  }, []);

  const handleSplashFinished = useCallback(() => {
    setShowSplash(false);
  }, []);

  if (showSplash) {
    return <SplashScreen onFinished={handleSplashFinished} />;
  }

  return <>{children}</>;
}
