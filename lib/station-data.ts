import type { Station } from '@/types';

const parseGenres = (genreString: string): string[] => {
  if (!genreString) return [];
  return genreString.split(/,|-|\sy\sMas/).map(tag => tag.trim()).filter(tag => tag.length > 0 && tag.toLowerCase() !== 'y mas');
};

const parseLocation = (locationString: string): { country: string, city: string | null, state: string | null, countryCode: string, stateCode: string | null } => {
  // Basic parsing, can be expanded
  if (locationString.toLowerCase().includes('ocaña')) {
    return { country: 'Colombia', city: 'Ocaña', state: '', countryCode: 'CO', stateCode: 'NSA' };
  }
  if (locationString.toLowerCase() === 'america latina') {
    return { country: 'América Latina', city: null, state: null, countryCode: 'XL', stateCode: null };
  }
  if (locationString.toLowerCase() === 'colombia') {
    return { country: 'Colombia', city: null, state: null, countryCode: 'CO', stateCode: null };
  }
  if (locationString.toLowerCase() === 'perú') {
    return { country: 'Perú', city: null, state: null, countryCode: 'PE', stateCode: null };
  }
  if (locationString.toLowerCase() === 'mundo') {
    return { country: 'Mundo', city: null, state: null, countryCode: 'WD', stateCode: null }; // WD for World
  }
  // Default fallback if no specific parsing rule matches
  const parts = locationString.split(' - ');
  if (parts.length === 2) {
    // Assuming "City - Country" or "Region - Country"
    return { country: parts[1], city: parts[0], state: null, countryCode: parts[1].substring(0,2).toUpperCase(), stateCode: null };
  }
  return { country: locationString, city: null, state: null, countryCode: locationString.substring(0,2).toUpperCase(), stateCode: null };
};


export const stations: Station[] = [
  {
    id: "1",
    name: "Radio City Latino",
    ...parseLocation("America Latina"),
    tags: parseGenres("Rock, Pop"),
    logoUrl: "https://i.imgur.com/wXXfnr5.png",
    streamUrl: "https://voicevoz.com/listen/radio_city_latino/radio.mp3",
    metadataUrl: "https://voicevoz.com/api/nowplaying_static/radio_city_latino.json",
    whatsappUrl: "https://wa.me/573008346736",
    instagramUrl: "https://www.instagram.com/radio_city_88.9?igsh=em9sbjlrcnd1a3U4&utm_source=qr",
    tiktokUrl: "https://tiktok.com/@radiocitylatino",
    email: "contacto@emisorasdelmundo.com",
  },
  {
    id: "2",
    name: "Amor Stereo",
    ...parseLocation("America Latina"),
    tags: parseGenres("Baladas"),
    logoUrl: "https://i.imgur.com/z97xeFp.png",
    streamUrl: "https://voicevoz.com/listen/amor_stereo/radio.mp3", 
    metadataUrl: "https://voicevoz.com/api/nowplaying_static/amor_stereo.json",
    whatsappUrl: "https://wa.me/573008346736",
    instagramUrl: "https://www.instagram.com/emisorasdelmundo?utm_source=qr&igsh=MnY2aHl6ZThiejdu",
    tiktokUrl: "https://tiktok.com/@amorstereo",
    email: "contacto@emisorasdelmundo.com",
  },
  {
    id: "3",
    name: "La Sinverguenza",
    ...parseLocation("America Latina"),
    tags: parseGenres("Musica"),
    logoUrl: "https://i.imgur.com/1QH70nH.png",
    streamUrl: "https://voicevoz.com/listen/la_sinverguenza/radio.mp3",
    metadataUrl: "https://voicevoz.com/api/nowplaying_static/la_sinverguenza.json",
    whatsappUrl: "https://wa.me/573008346736",
    instagramUrl: "https://www.instagram.com/emisorasdelmundo?utm_source=qr&igsh=MnY2aHl6ZThiejdu",
    tiktokUrl: "https://tiktok.com/@lasinverguanza",
    email: "contacto@emisorasdelmundo.com",
  },
  {
    id: "4",
    name: "Tu Salsa Radio",
    ...parseLocation("America Latina"),
    tags: parseGenres("Musica-Salsa"),
    logoUrl: "https://i.imgur.com/YL3xXmR.png",
    streamUrl: "https://voicevoz.com/listen/tu_salsa_radio/radio.mp3",
    metadataUrl: "https://voicevoz.com/api/nowplaying_static/tu_salsa_radio.json",
    whatsappUrl: "https://wa.me/573008346736",
    instagramUrl: "https://www.instagram.com/emisorasdelmundo?utm_source=qr&igsh=MnY2aHl6ZThiejdu",
    tiktokUrl: "https://tiktok.com/@tusalsaradio",
    email: "contacto@emisorasdelmundo.com",
  },
  {
    id: "5",
    name: "VoiceVoz",
    ...parseLocation("Mundo"),
    tags: parseGenres("Noticias del Mundo"),
    logoUrl: "https://i.imgur.com/4PD1ErK.png",
    streamUrl: "https://voicevoz.com/listen/voicevoz/radio.mp3",
    metadataUrl: "https://voicevoz.com/api/nowplaying_static/voicevoz.json",
    whatsappUrl: "https://wa.me/573008346736",
    instagramUrl: "https://www.instagram.com/voicevoz/",
    tiktokUrl: "https://www.tiktok.com/@voicevoz",
    email: "contacto@emisorasdelmundo.com",
  },
  {
    id: "6",
    name: "AMAV Radio",
    ...parseLocation("America Latina"),
    tags: parseGenres("Rock, Pop"),
    logoUrl: "https://i.imgur.com/1pBUrrs.png",
    streamUrl: "https://voicevoz.com/listen/amav_radio/radio.mp3",
    metadataUrl: "https://voicevoz.com/api/nowplaying_static/amav_radio.json",
    whatsappUrl: "https://wa.me/573008346736",
    instagramUrl: "https://www.instagram.com/artistasdelavoz?igsh=MTJiemt1NzJ4ZDVpZg==",
    tiktokUrl: "https://tiktok.com/@amavradio",
    email: "contacto@emisorasdelmundo.com",
  },
  {
    id: "7",
    name: "La UFM Estereo",
    ...parseLocation("Ocaña - Colombia"),
    tags: parseGenres("Música del Mundo"),
    logoUrl: "https://cdn-radiotime-logos.tunein.com/s232143d.png",
    streamUrl: "https://streamingufm.ufpso.edu.co/getStream",
    metadataUrl: "https://streamingufm.ufpso.edu.co/status-json.xsl",
    whatsappUrl: "https://wa.me/573175828289",
    instagramUrl: "https://www.instagram.com/laufmradio/",
    tiktokUrl: "https://www.tiktok.com/@laufmradio",
    email: "contacto@emisorasdelmundo.com",
  },
  {
    id: "8",
    name: "Espléndida Radio",
    ...parseLocation("Perú"),
    tags: parseGenres("Salsa Merengue Reggaetón y Mas"),
    logoUrl: "https://i.imgur.com/Q1fmU1N.png",
    streamUrl: "https://radiostreamingonline.com/listen/esplendida/live",
    metadataUrl: "https://radiostreamingonline.com/listen/esplendida/live",
    whatsappUrl: "https://wa.me/51961002379",
    instagramUrl: "https://www.facebook.com/people/Espl%C3%A9ndidaradio-Trujillo/61552650565529/",
    tiktokUrl: "https://www.tiktok.com/@esplendidaradio",
    email: "contacto@emisorasdelmundo.com",
  },
  {
    id: "9",
    name: "Orbita Radio",
    ...parseLocation("Perú"),
    tags: parseGenres("Rock - Pop - Baladas"),
    logoUrl: "https://i.imgur.com/M35oW3t.png",
    streamUrl :"https://radiostreamingonline.com/listen/orbitaradio/live",
    metadataUrl: "https://radiostreamingonline.com/listen/orbitaradio/live",
    whatsappUrl: "https://wa.me/51961002379",
    instagramUrl: "https://www.instagram.com/orbitaradiotrujillo/",
    tiktokUrl: "https://www.tiktok.com/@orbitaradio",
    email: "contacto@emisorasdelmundo.com",
  },
  {
    id: "10",
    name: "Radio Catatumbo",
    ...parseLocation("Ocaña - Colombia"),
    tags: parseGenres("Musica - Noticias"),
    logoUrl: "https://i.imgur.com/IZQqWe0.jpeg",
    streamUrl: "https://server1.intermediacolombia.com/8086/stream",
    metadataUrl: "https://server1.intermediacolombia.com:8086/stats?sid=1&json=1",
    whatsappUrl: "https://wa.me/573133380747",
    instagramUrl: "https://instagram.com/radiocatatumbo",
    tiktokUrl: "https://tiktok.com/@radiocatatumbo",
    email: "contacto@emisorasdelmundo.com",
  },
  {
    id: "11",
    name: "Ocaña Stereo",
    ...parseLocation("Colombia"),
    tags: parseGenres("Musica"),
    logoUrl: "https://i.imgur.com/oCH7TO2.jpeg",
    streamUrl: "https://play10.tikast.com:20156/stream",
    metadataUrl: "https://play10.tikast.com:20156/stats?sid=1&json=1",
    whatsappUrl: "https://wa.me/573008346736",
    instagramUrl: "https://instagram.com/ocanastereo",
    tiktokUrl: "https://tiktok.com/@ocanastereo",
    email: "contacto@emisorasdelmundo.com",
  },
  {
    id: "12",
    name: "Radiomia",
    ...parseLocation("Colombia"),
    tags: parseGenres("Musica"),
    logoUrl: "https://www.appcreator24.com/srv/imgs/seccs/34847329_ico.png?ts=1747777720",
    streamUrl: "https://stream-173.zeno.fm/lhtrhyvmfuctv",
    metadataUrl: "https://proxy.zeno.fm/api/zeno/nowplaying/lhtrhyvmfuctv",
    whatsappUrl: "https://wa.me/573008346736",
    instagramUrl: "https://instagram.com/radiomia",
    tiktokUrl: "https://tiktok.com/@radiomia",
    email: "contacto@emisorasdelmundo.com",
  }
];

// --- Funciones de utilidad (sin cambios, solo para referencia) ---
export const getCountries = (): { name: string; code: string }[] => {
  const countries = stations.map(station => ({ name: station.country, code: station.countryCode }));
  // Remove duplicates based on country code
  const uniqueCountries = Array.from(new Map(countries.map(item => [item.code, item])).values());
  return uniqueCountries;
};

export const getStatesByCountry = (countryCode: string): { name: string; code: string; countryCode: string }[] => {
  const states = stations
    .filter(station => station.countryCode === countryCode && station.state && station.stateCode)
    .map(station => ({ name: station.state!, code: station.stateCode!, countryCode }));
  const uniqueStates = Array.from(new Map(states.map(item => [item.code, item])).values());
  return uniqueStates;
};

export const getCitiesByState = (countryCode: string, stateCode: string): { name: string; stateCode: string; countryCode: string }[] => {
  const cities = stations
    .filter(station => station.countryCode === countryCode && station.stateCode === stateCode && station.city)
    .map(station => ({ name: station.city!, stateCode, countryCode }));
  const uniqueCities = Array.from(new Map(cities.map(item => [item.name, item])).values());
  return uniqueCities;
};

export const getCitiesByCountry = (countryCode: string): { name: string; countryCode: string }[] => {
  const cities = stations
    .filter(station => station.countryCode === countryCode && !station.stateCode && station.city) // No stateCode means it's a city directly under a country
    .map(station => ({ name: station.city!, countryCode }));
  const uniqueCities = Array.from(new Map(cities.map(item => [item.name, item])).values());
  return uniqueCities;
};


export const getStationsByCountry = (countryCode: string): Station[] => {
  return stations.filter(station => station.countryCode === countryCode && !station.stateCode && !station.city);
};

export const getStationsByState = (countryCode: string, stateCode: string): Station[] => {
  return stations.filter(station => station.countryCode === countryCode && station.stateCode === stateCode && !station.city);
};

export const getStationsByCity = (countryCode: string, citySpec: { name: string; stateCode?: string | null }): Station[] => {
  return stations.filter(station =>
    station.countryCode === countryCode &&
    station.city === citySpec.name &&
    (citySpec.stateCode ? station.stateCode === citySpec.stateCode : !station.stateCode)
  );
};

export const getStationById = (id: string): Station | undefined => {
  return stations.find(s => s.id === id);
};

export const getFavoriteStations = (ids: string[]): Station[] => {
  return stations.filter(s => ids.includes(s.id));
};