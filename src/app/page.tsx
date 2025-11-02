
"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/main-layout';
import BrowseView from '@/components/browse/browse-view';
import PodcastsView from '@/components/podcasts/podcasts-view';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState('emisoras');
  const router = useRouter();

  const handleTabChange = (value: string) => {
    if (value === 'podcasts') {
      router.push('/podcasts');
    } else {
      setActiveTab(value);
    }
  };

  return (
    <MainLayout
      activeTab={activeTab}
      onTabChange={handleTabChange}
      emisorasContent={<BrowseView />}
      podcastsContent={<PodcastsView />}
    />
  );
}
