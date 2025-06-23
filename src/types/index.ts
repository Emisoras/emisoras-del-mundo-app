
export interface Station {
  id: string;
  name: string;
  streamUrl: string;
  logoUrl?: string;
  country: string;
  state?: string | null;
  city?: string | null;
  countryCode: string; // e.g., 'CO' for Colombia, 'PE' for Peru, 'XL' for Latin America (generic)
  stateCode?: string | null;
  tags?: string[]; // For genres
  whatsappUrl?: string;
  instagramUrl?: string;
  tiktokUrl?: string;
  email?: string; // For the email link
  metadataUrl?: string; // URL to fetch now-playing metadata
}

export interface Country {
  name: string;
  code: string;
}

export interface State {
  name: string;
  code: string;
  countryCode: string;
}

export interface City {
  name: string;
  stateCode?: string | null;
  countryCode: string;
}
