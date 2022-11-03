import { Coordinates } from "../types/cartography";
import { Degrees } from "../types/math";
import { degToRad, radToDeg } from "./math";

/**
 * Test whether geolocation services are available in the browser.
 * @returns Boolean value indicating availability of the geolocation service.
 */
export function geolocationAvailable() {
  return "geolocation" in navigator;
}

/**
 * Calculate the shortest distance between two locations.
 * @param loc1 Coordinates of first location.
 * @param loc2 Coordinates of second location.
 * @returns Shortest distance between the two locations, in kilometers.
 */
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

/**
 * The haversine formula.
 * @param theta The central angle between two points.
 * @returns The haversine.
 */
function hav(theta: number) {
  return Math.sin(theta / 2) ** 2;
}

/**
 * Calculate the absolute bearing from the first location to the second.
 * @param loc1 Coordinates of first location.
 * @param loc2 Coordinates of second location.
 * @returns Compass heading from loc1 to loc2 in degrees.
 */
export function getBearing(loc1: Coordinates, loc2: Coordinates): Degrees {
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
