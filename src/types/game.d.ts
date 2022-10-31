import { Coordinates } from "./cartography";

export interface CurrentLocation {
  location: string;
  coordinates: Coordinates;
}

export interface CompletedLocation extends CurrentLocation {
  score: number;
}
