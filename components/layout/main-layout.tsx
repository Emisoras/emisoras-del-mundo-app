import type { ReactNode } from 'react';
import AppHeader from './app-header';
import BottomPlayer from './bottom-player';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import ImageSlider from './image-slider';

interface MainLayoutProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  emisorasContent: ReactNode;
  podcastsContent: ReactNode;
}

export default function MainLayout({ activeTab, onTabChange, emisorasContent, podcastsContent }: MainLayoutProps) {
  return (
    <div className="flex h-screen flex-col">
      <AppHeader />
      <div className="container mx-auto px-4 py-2 flex flex-col flex-grow min-h-0">
        <Tabs value={activeTab} onValueChange={onTabChange} className="w-full flex flex-col flex-grow min-h-0">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger 
              value="emisoras" 
              className="pb-2 text-base md:text-lg data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary text-muted-foreground hover:text-foreground transition-colors data-[state=inactive]:bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              Emisoras
            </TabsTrigger>
            <TabsTrigger 
              value="podcasts" 
              className="pb-2 text-base md:text-lg data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary text-muted-foreground hover:text-foreground transition-colors data-[state=inactive]:bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              Podcasts
            </TabsTrigger>
          </TabsList>
          
          <div className="flex-grow min-h-0">
            <TabsContent value="emisoras" className="h-full m-0">
              {emisorasContent}
            </TabsContent>
            <TabsContent value="podcasts" className="h-full m-0">
              {podcastsContent}
            </TabsContent>
          </div>
        </Tabs>
      </div>
      
      {activeTab === 'emisoras' && (
        <div className="container mx-auto px-4 flex-shrink-0 py-2">
            <ImageSlider />
        </div>
      )}

      {/* This div provides padding at the bottom, accounting for the BottomPlayer's height */}
      <div className="pb-20 flex-shrink-0"></div>
      
      <BottomPlayer />
    </div>
  );
}
