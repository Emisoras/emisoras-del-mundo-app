
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface ImageSliderProps {
  images: { src: string; alt: string; dataAiHint?: string }[];
  interval?: number;
}

export default function ImageSlider({ images, interval = 5000 }: ImageSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 2 >= images.length ? 0 : prevIndex + 2));
  }, [images.length]);

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 2 < 0 ? images.length - (images.length % 2 === 0 ? 2 : 1) : prevIndex - 2));
  };

  useEffect(() => {
    if (images.length <= 2) return; // No need to slide if 2 or fewer images
    const autoPlayTimer = setInterval(nextSlide, interval);
    return () => clearInterval(autoPlayTimer);
  }, [nextSlide, interval, images.length]);

  if (!images || images.length === 0) {
    return null;
  }

  const currentImage1 = images[currentIndex];
  const currentImage2 = images.length > 1 ? images[(currentIndex + 1) % images.length] : null;
  
  // Ensure we don't show the same image twice if there's an odd number and we are at the end
  const displaySecondImage = images.length > 1 && (currentIndex + 1) < images.length;


  return (
    <div className="relative w-full">
      <div className="flex justify-center items-center gap-4 overflow-hidden">
        {currentImage1 && (
          <Card className="w-1/2 shadow-md overflow-hidden">
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
        )}
        {displaySecondImage && currentImage2 && (
          <Card className="w-1/2 shadow-md overflow-hidden">
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
        )}
      </div>
      {images.length > 2 && (
        <>
          <Button
            variant="outline"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 transform bg-background/50 hover:bg-background/80 backdrop-blur-sm rounded-full -ml-2 z-10"
            onClick={prevSlide}
            aria-label="Anterior"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 transform bg-background/50 hover:bg-background/80 backdrop-blur-sm rounded-full -mr-2 z-10"
            onClick={nextSlide}
            aria-label="Siguiente"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </>
      )}
    </div>
  );
}
