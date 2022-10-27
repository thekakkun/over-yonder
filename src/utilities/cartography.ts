import { Degrees, degToRad, Radians, radToDeg } from "./math";

export interface Coordinates {
  latitude: Degrees;
  longitude: Degrees;
}

export function geolocationAvailable() {
  return "geolocation" in navigator;
}

export function getDistance(loc1: Coordinates, loc2: Coordinates) {
  const R = 6371e3;

  const lat1 = degToRad(loc1.latitude);
  const lat2 = degToRad(loc2.latitude);
  const latDelta = lat2 - lat1;
  const lonDelta = degToRad(loc2.longitude - loc1.longitude);
  // TODO: Beware of floating point errors here
  const h = hav(latDelta) + Math.cos(lat1) * Math.cos(lat2) * hav(lonDelta);

  return 2 * R * Math.asin(Math.sqrt(h));
}

function hav(theta: Radians) {
  return Math.sin(theta / 2) ** 2;
}

export function getBearing(loc1: Coordinates, loc2: Coordinates) {
  const lat1 = degToRad(loc1.latitude);
  const lat2 = degToRad(loc2.latitude);
  const lon1 = degToRad(loc1.longitude);
  const lon2 = degToRad(loc2.longitude);

  const y = Math.sin(lon2 - lon1) * Math.cos(lat2);
  const x =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1);
  const theta = Math.atan2(y, x);

  return (radToDeg(theta) + 360) % 360;
}
