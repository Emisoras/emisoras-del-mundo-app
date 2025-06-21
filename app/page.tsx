
// @ts-nocheck
"use client";

import React, { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/main-layout';
import BrowseView from '@/components/browse/browse-view';
import SplashScreen from '@/components/layout/splash-screen';
import PodcastsView from '@/components/podcasts/podcasts-view'; // This will not be rendered if navigation occurs

export default function HomePage() {
  const [activeTab, setActiveTab] = useState('emisoras');
  const [showSplash, setShowSplash] = useState(true);
  const router = useRouter();

  const handleTabChange = (value: string) => {
    if (value === 'podcasts') {
      router.push('/podcasts');
    } else {
      setActiveTab(value);
    }
  };

  const handleSplashFinished = useCallback(() => {
    setShowSplash(false);
  }, []);

  if (showSplash) {
    return <SplashScreen onFinished={handleSplashFinished} />;
  }

  return (
    <MainLayout
      activeTab={activeTab}
      onTabChange={handleTabChange}
      emisorasContent={<BrowseView />}
      podcastsContent={<PodcastsView />} // This content is for the "podcasts" tab if no navigation occurred
    />
  );
}
