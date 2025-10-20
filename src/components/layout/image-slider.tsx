
"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useFirestore, useCollection } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import type { Slider } from '@/types';

interface ImageSliderProps {
  interval?: number;
}

export default function ImageSlider({ interval = 5000 }: ImageSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const firestore = useFirestore();

  const slidersQuery = useMemo(() => query(collection(firestore, 'sliders'), orderBy('order')), [firestore]);
  const { data: images, loading } = useCollection<Slider>(slidersQuery);

  const slidesPerPage = 2;

  const nextSlide = useCallback(() => {
    if (!images) return;
    setCurrentIndex((prevIndex) => {
      const nextIndex = prevIndex + slidesPerPage;
      return nextIndex >= images.length ? 0 : nextIndex;
    });
  }, [images, slidesPerPage]);

  const prevSlide = () => {
    if (!images) return;
    setCurrentIndex((prevIndex) => {
      if (prevIndex - slidesPerPage < 0) {
        return Math.floor((images.length - 1) / slidesPerPage) * slidesPerPage;
      }
      return prevIndex - slidesPerPage;
    });
  };

  useEffect(() => {
    if (!images || images.length <= slidesPerPage) return;
    const autoPlayTimer = setInterval(nextSlide, interval);
    return () => clearInterval(autoPlayTimer);
  }, [nextSlide, interval, images, slidesPerPage]);

  if (loading) {
    return (
        <div className="flex justify-center items-center h-20">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
    );
  }

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <div className="relative w-full">
      <div className="flex justify-center items-center gap-4 overflow-hidden">
        {Array.from({ length: slidesPerPage }).map((_, index) => {
            const imageIndex = currentIndex + index;
            if (imageIndex >= images.length) {
              return <div key={index} className="w-1/2" />;
            }
            const image = images[imageIndex];
            
            return (
              <a 
                key={image.id}
                href={image.linkUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="block w-1/2 transition-all hover:scale-105"
              >
                <Card className="shadow-md overflow-hidden">
                  <CardContent className="p-0">
                    <div className="w-full h-20 relative">
                        <Image
                            src={image.src}
                            alt={image.alt}
                            fill
                            className="object-contain"
                            data-ai-hint={image.dataAiHint}
                        />
                    </div>
                  </CardContent>
                </Card>
              </a>
            );
        })}
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
