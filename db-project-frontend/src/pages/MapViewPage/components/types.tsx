// MapViewPage/components/types.ts

export interface Crime {
  id: number;
  title: string;
  description: string;
  crimeType: string;
  zoneName: string;
  date: string;
  address: string;
  location: { lat: number; lng: number };
}
