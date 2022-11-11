import { Degrees } from "./math";

export interface Location {
  city: string;
  country: string;
}

export interface Coordinates {
  longitude: Degrees;
  latitude: Degrees;
}
