
"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { LoaderCircle } from 'lucide-react';

interface SplashScreenProps {
  onFinished: () => void;
}

export default function SplashScreen({ onFinished }: SplashScreenProps) {
  const [stage, setStage] = useState(0); // 0 for loading, 1 for logo

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setStage(1); // Move to logo stage
    }, 1000); // Show loading for 1 second

    const timer2 = setTimeout(() => {
      onFinished(); // Finish splash after total 4 seconds
    }, 4000); // Total splash duration 4 seconds (1s loading + 3s logo)

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [onFinished]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
      {stage === 0 && (
        <div className="flex flex-col items-center">
          <LoaderCircle className="w-16 h-16 text-primary animate-spin" />
          <p className="mt-4 text-lg">Cargando...</p>
        </div>
      )}
      {stage === 1 && (
        <div className="flex flex-col items-center text-center">
          <Image
            src="https://www.appcreator24.com/srv/imgs/gen/3584998_splash.png?ts=1747769697"
            alt="Emisoras del Mundo Logo"
            width={200}
            height={80}
            priority
            className="object-contain"
            data-ai-hint="emisoras radio"
          />
          <h1 className="text-3xl font-bold text-primary mt-4">Emisoras del Mundo</h1>
          <p className="text-md text-muted-foreground">¡RADIO PARA TODOS!</p>
        </div>
      )}
    </div>
  );
}
