import { GeoProjection } from "d3-geo";
import { Degrees } from "./math";

export interface Location {
  city: string;
  country: string;
}

export interface Coordinates {
  longitude: Degrees;
  latitude: Degrees;
}

export interface VersorGeoProjection extends GeoProjection {
  _scale: number | undefined;
}
