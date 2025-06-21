import type { ReactNode } from 'react';
import AppHeader from './app-header';
import BottomPlayer from './bottom-player';
// ImageSlider is now imported and used within BrowseView
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

interface MainLayoutProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  emisorasContent: ReactNode;
  podcastsContent: ReactNode;
}

export default function MainLayout({ activeTab, onTabChange, emisorasContent, podcastsContent }: MainLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader />
      <div className="container mx-auto px-4 py-2 flex-grow"> {/* Added flex-grow */}
        <Tabs value={activeTab} onValueChange={onTabChange} className="w-full flex flex-col h-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger 
              value="emisoras" 
              className="pb-2 text-lg data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary text-muted-foreground hover:text-foreground transition-colors data-[state=inactive]:bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              Emisoras
            </TabsTrigger>
            <TabsTrigger 
              value="podcasts" 
              className="pb-2 text-lg data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary text-muted-foreground hover:text-foreground transition-colors data-[state=inactive]:bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              Podcasts
            </TabsTrigger>
          </TabsList>
          <TabsContent value="emisoras" className="flex-grow"> {/* Changed min-h to flex-grow */}
            {emisorasContent}
          </TabsContent>
          <TabsContent value="podcasts" className="flex-grow"> {/* Changed min-h to flex-grow */}
            {podcastsContent}
          </TabsContent>
        </Tabs>
      </div>
      
      {/* ImageSlider moved to BrowseView.tsx */}

      <div className="pb-20"> {/* Padding for BottomPlayer */}
      </div>
      <BottomPlayer />
    </div>
  );
}
