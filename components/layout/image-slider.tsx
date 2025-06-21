
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface ImageSliderProps {
  images: { src: string; alt: string; dataAiHint?: string }[];
  interval?: number;
}

export default function ImageSlider({ images, interval = 5000 }: ImageSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const isMobile = useIsMobile();
  const whatsappUrl = "https://wa.me/51941319613";

  const slidesPerPage = isMobile ? 1 : 2;

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => {
      const nextIndex = prevIndex + slidesPerPage;
      return nextIndex >= images.length ? 0 : nextIndex;
    });
  }, [images.length, slidesPerPage]);

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => {
      if (prevIndex - slidesPerPage < 0) {
        // Go to the last possible page
        return Math.floor((images.length - 1) / slidesPerPage) * slidesPerPage;
      }
      return prevIndex - slidesPerPage;
    });
  };

  useEffect(() => {
    // Reset index if slidesPerPage changes to avoid being out of bounds
    setCurrentIndex(0);
  }, [isMobile]);

  useEffect(() => {
    if (images.length <= slidesPerPage) return;
    const autoPlayTimer = setInterval(nextSlide, interval);
    return () => clearInterval(autoPlayTimer);
  }, [nextSlide, interval, images.length, slidesPerPage]);

  if (!images || images.length === 0 || currentIndex >= images.length) {
    return null;
  }

  const currentImage1 = images[currentIndex];
  const currentImage2 = !isMobile && images.length > currentIndex + 1 ? images[currentIndex + 1] : null;

  return (
    <div className="relative w-full">
      <div className="flex justify-center items-center gap-4 overflow-hidden">
        {currentImage1 && (
           <a 
            href={whatsappUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className={cn("block transition-all hover:scale-105", isMobile ? "w-full" : "w-1/2")}
          >
            <Card className="shadow-md overflow-hidden">
              <CardContent className="p-0">
                <Image
                  src={currentImage1.src}
                  alt={currentImage1.alt}
                  width={300}
                  height={150}
                  className="object-cover w-full h-auto aspect-[2/1]"
                  data-ai-hint={currentImage1.dataAiHint}
                />
              </CardContent>
            </Card>
          </a>
        )}
        {currentImage2 && (
          <a 
            href={whatsappUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="block w-1/2 transition-all hover:scale-105"
          >
            <Card className="shadow-md overflow-hidden">
              <CardContent className="p-0">
                <Image
                  src={currentImage2.src}
                  alt={currentImage2.alt}
                  width={300}
                  height={150}
                  className="object-cover w-full h-auto aspect-[2/1]"
                  data-ai-hint={currentImage2.dataAiHint}
                />
              </CardContent>
            </Card>
          </a>
        )}
      </div>
      {images.length > slidesPerPage && (
        <>
          <Button
            variant="outline"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 transform bg-background/50 hover:bg-background/80 backdrop-blur-sm rounded-full -ml-2 z-10"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); prevSlide(); }}
            aria-label="Anterior"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 transform bg-background/50 hover:bg-background/80 backdrop-blur-sm rounded-full -mr-2 z-10"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); nextSlide(); }}
            aria-label="Siguiente"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </>
      )}
    </div>
  );
}
