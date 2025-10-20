
"use client";

import React, { useState, useMemo, useEffect } from 'react';
import type { Station } from '@/types';
import { useFirestore, useCollection } from '@/firebase';
import type { WithId } from '@/firebase/firestore/use-collection';
import { collection, doc, writeBatch, getDocs, query, orderBy } from 'firebase/firestore';
import StationItem from '@/components/station/station-item';
import { Search, Loader2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

const stationsToMigrate: Omit<Station, 'id'>[] = [
    { order: 1, name: "Radio City Latino", streamUrl: "https://voicevoz.com/listen/radio_city_latino/radio.mp3", logoUrl: "https://i.imgur.com/wXXfnr5.png", country: "America Latina", countryCode: "XL", tags: ["Rock", "Pop"], whatsappUrl: "https://wa.me/573008346736", instagramUrl: "https://www.instagram.com/radio_city_88.9?igsh=em9sbjlrcnd1a3U4&utm_source=qr", tiktokUrl: "https://tiktok.com/@radiocitylatino", email: "contacto@emisorasdelmundo.com", metadataUrl: "https://voicevoz.com/api/nowplaying_static/radio_city_latino.json" },
    { order: 2, name: "Amor Stereo", streamUrl: "https://voicevoz.com/listen/amor_stereo/radio.mp3", logoUrl: "https://i.imgur.com/z97xeFp.png", country: "America Latina", countryCode: "XL", tags: ["Baladas"], whatsappUrl: "https://wa.me/573008346736", instagramUrl: "https://www.instagram.com/emisorasdelmundo?utm_source=qr&igsh=MnY2aHl6ZThiejdu", tiktokUrl: "https://tiktok.com/@amorstereo", email: "contacto@emisorasdelmundo.com", metadataUrl: "https://voicevoz.com/api/nowplaying_static/amor_stereo.json" },
    { order: 3, name: "La Sinverguenza", streamUrl: "https://voicevoz.com/listen/la_sinverguenza/radio.mp3", logoUrl: "https://i.imgur.com/1QH70nH.png", country: "America Latina", countryCode: "XL", tags: ["Musica"], whatsappUrl: "https://wa.me/573008346736", instagramUrl: "https://www.instagram.com/emisorasdelmundo?utm_source=qr&igsh=MnY2aHl6ZThiejdu", tiktokUrl: "https://tiktok.com/@lasinverguanza", email: "contacto@emisorasdelmundo.com", metadataUrl: "https://voicevoz.com/api/nowplaying_static/la_sinverguenza.json" },
    { order: 4, name: "Tu Salsa Radio", streamUrl: "https://voicevoz.com/listen/tu_salsa_radio/radio.mp3", logoUrl: "https://i.imgur.com/s34fr0X.png", country: "America Latina", countryCode: "XL", tags: ["Musica", "Salsa"], whatsappUrl: "https://wa.me/573008346736", instagramUrl: "https://www.instagram.com/emisorasdelmundo?utm_source=qr&igsh=MnY2aHl6ZThiejdu", tiktokUrl: "https://tiktok.com/@tusalsaradio", email: "contacto@emisorasdelmundo.com", metadataUrl: "https://voicevoz.com/api/nowplaying_static/tu_salsa_radio.json" },
    { order: 5, name: "VoiceVoz", streamUrl: "https://voicevoz.com/listen/voicevoz/radio.mp3", logoUrl: "https://i.imgur.com/4PD1ErK.png", country: "Mundo", countryCode: "XX", tags: ["Noticias del Mundo"], whatsappUrl: "https://wa.me/573008346736", instagramUrl: "https://www.instagram.com/voicevoz/", tiktokUrl: "https://www.tiktok.com/@voicevoz", email: "contacto@emisorasdelmundo.com", metadataUrl: "https://voicevoz.com/api/nowplaying_static/voicevoz.json" },
    { order: 6, name: "AMAV Radio", streamUrl: "https://voicevoz.com/listen/amav_radio/radio.mp3", logoUrl: "https://i.imgur.com/1pBUrrs.png", country: "America Latina", countryCode: "XL", tags: ["Rock", "Pop"], whatsappUrl: "https://wa.me/573008346736", instagramUrl: "https://www.instagram.com/artistasdelavoz?igsh=MTJiemt1NzJ4ZDVpZg==", tiktokUrl: "https://tiktok.com/@amavradio", email: "contacto@emisorasdelmundo.com", metadataUrl: "https://voicevoz.com/api/nowplaying_static/amav_radio.json" },
    { order: 7, name: "La UFM Estereo", streamUrl: "https://streamingufm.ufpso.edu.co/getStream", logoUrl: "https://cdn-radiotime-logos.tunein.com/s232143d.png", city: "Ocaña", country: "Colombia", countryCode: "CO", tags: ["Música del Mundo"], whatsappUrl: "https://wa.me/573175828289", instagramUrl: "https://www.instagram.com/laufmradio/", tiktokUrl: "https://www.tiktok.com/@laufmradio", email: "contacto@emisorasdelmundo.com", metadataUrl: "https://streamingufm.ufpso.edu.co/status-json.xsl" },
    { order: 8, name: "Espléndida Radio", streamUrl: "https://radiostreamingonline.com/listen/esplendida/live", logoUrl: "https://i.imgur.com/Q1fmU1N.png", country: "Perú", countryCode: "PE", tags: ["Salsa", "Merengue", "Reggaetón", "Mas"], whatsappUrl: "https://wa.me/51961002379", instagramUrl: "https://www.facebook.com/people/Espl%C3%A9ndidaradio-Trujillo/61552650565529/", tiktokUrl: "https://www.tiktok.com/@esplendidaradio", email: "contacto@emisorasdelmundo.com", metadataUrl: "https://radiostreamingonline.com/listen/esplendida/live" },
    { order: 9, name: "Orbita Radio", streamUrl: "https://radiostreamingonline.com/listen/orbitaradio/live", logoUrl: "https://i.imgur.com/7yblhCc.png", country: "Perú", countryCode: "PE", tags: ["Rock", "Pop", "Baladas"], whatsappUrl: "https://wa.me/51961002379", instagramUrl: "https://www.instagram.com/orbitaradiotrujillo/", tiktokUrl: "https://www.tiktok.com/@orbitaradio", email: "contacto@emisorasdelmundo.com", metadataUrl: "https://radiostreamingonline.com/listen/orbitaradio/live" },
    { order: 10, name: "Radio Catatumbo", streamUrl: "https://server1.intermediacolombia.com/8086/stream", logoUrl: "https://i.imgur.com/IZQqWe0.jpeg", city: "Ocaña", country: "Colombia", countryCode: "CO", tags: ["Musica", "Noticias"], whatsappUrl: "https://wa.me/573133380747", instagramUrl: "https://instagram.com/radiocatatumbo", tiktokUrl: "https://tiktok.com/@radiocatatumbo", email: "contacto@emisorasdelmundo.com", metadataUrl: "https://server1.intermediacolombia.com:8086/stats?sid=1&json=1" },
    { order: 11, name: "Ocaña Stereo", streamUrl: "https://play10.tikast.com:20156/stream", logoUrl: "https://i.imgur.com/W0iaQrP.jpeg", country: "Colombia", countryCode: "CO", tags: ["Musica"], whatsappUrl: "https://wa.me/573008346736", instagramUrl: "https://instagram.com/ocanastereo", tiktokUrl: "https://tiktok.com/@ocanastereo", email: "contacto@emisorasdelmundo.com", metadataUrl: "https://play10.tikast.com:20156/stats?sid=1&json=1" },
    { order: 12, name: "Radiomia", streamUrl: "https://stream-173.zeno.fm/lhtrhyvmfuctv", logoUrl: "https://www.appcreator24.com/srv/imgs/seccs/34847329_ico.png?ts=1747777720", country: "Colombia", countryCode: "CO", tags: ["Musica"], whatsappUrl: "https://wa.me/573008346736", instagramUrl: "https://instagram.com/radiomia", tiktokUrl: "https://tiktok.com/@radiomia", email: "contacto@emisorasdelmundo.com", metadataUrl: "https://proxy.zeno.fm/api/zeno/nowplaying/lhtrhyvmfuctv" }
];


export default function BrowseView() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isMigrating, setIsMigrating] = useState(true);
  const firestore = useFirestore();

  const stationsQuery = useMemo(() => {
    return query(collection(firestore, 'stations'), orderBy('order'));
  }, [firestore]);

  const { data: allStations, loading, error } = useCollection<WithId<Station>>(stationsQuery);

  useEffect(() => {
    const handleMigration = async () => {
      const migrationKey = 'station_migration_v3_done';
      const migrationDone = localStorage.getItem(migrationKey);

      if (migrationDone) {
        setIsMigrating(false);
        return;
      }
      
      console.log("Starting data migration...");
      const stationsRef = collection(firestore, 'stations');
      
      try {
        console.log("Deleting old stations (if any)...");
        const existingDocs = await getDocs(stationsRef);
        if (!existingDocs.empty) {
          const deleteBatch = writeBatch(firestore);
          existingDocs.docs.forEach(doc => deleteBatch.delete(doc.ref));
          await deleteBatch.commit();
          console.log(`${existingDocs.size} old stations deleted.`);
        }

        console.log("Adding new stations...");
        const addBatch = writeBatch(firestore);
        stationsToMigrate.forEach(stationData => {
          const docRef = doc(stationsRef);
          addBatch.set(docRef, stationData);
        });
        await addBatch.commit();
        
        console.log("Migration complete!");
        localStorage.setItem(migrationKey, 'true');

      } catch (error: any) {
         if (error.code === 'permission-denied') {
            const permissionError = new FirestorePermissionError({
                path: stationsRef.path,
                operation: 'write',
                requestResourceData: stationsToMigrate
            });
            errorEmitter.emit('permission-error', permissionError);
            console.error('Migration permission error caught and emitted.');
         } else {
            console.error("An unexpected error occurred during migration:", error);
         }
      } finally {
        setIsMigrating(false);
      }
    };
    
    handleMigration();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firestore]);

  const filteredStations = useMemo(() => {
    if (!allStations) return [];
    if (!searchTerm) {
      return allStations;
    }
    return allStations.filter(station =>
      station.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (station.city && station.city.toLowerCase().includes(searchTerm.toLowerCase())) ||
      station.country.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, allStations]);
  
  if (isMigrating) {
     return (
        <div className="flex justify-center items-center py-8 h-full">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
            <span className="ml-2 mt-2 block">Migrando datos iniciales...</span>
          </div>
        </div>
      );
  }
  
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center mb-4 gap-2">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Buscar emisora..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full"
          />
        </div>
      </div>

      <p className="text-sm font-semibold mb-3 text-foreground">Todas las Emisoras</p>

      <ScrollArea className="flex-grow pr-1">
        {loading && (
            <div className="flex justify-center items-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )}
        {error && (
            <p className="text-center text-destructive py-8">Error al cargar emisoras: {error.message}</p>
        )}
        {!loading && !error && filteredStations.length > 0 ? (
          filteredStations.map((station, index) => <StationItem key={station.id || index} station={station} />)
        ) : (
          !loading && !error && <p className="text-center text-muted-foreground py-8">No se encontraron emisoras.</p>
        )}
      </ScrollArea>
    </div>
  );
}
