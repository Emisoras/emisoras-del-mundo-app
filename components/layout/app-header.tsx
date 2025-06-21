import React from 'react';
import Image from 'next/image';

export default function AppHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-center"> {/* Adjusted height and justification */}
        <Image 
          src="https://i.imgur.com/9RIqoC4.png"
          alt="Emisoras del Mundo Logo" 
          width={120} 
          height={40}
          className="object-contain"
          data-ai-hint="emisoras radio"
        />
      </div>
    </header>
  );
}
