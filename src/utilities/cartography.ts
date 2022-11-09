import { Coordinates } from "../types/cartography";
import { Degrees, Radians } from "../types/math";
import { degToRad, radToDeg } from "./math";

/** The earth's radius in kms */
const R = 6371;

/**
 * Test whether geolocation services are available in the browser.
 * @returns Boolean value indicating availability of the geolocation service.
 */
export function geolocationAvailable() {
  return "geolocation" in navigator;
}

/**
 * Normalize compass bearing to [0, 360] degrees
 * @param bearing Compass bearing in degrees
 * @returns Normalized bearing
 */
export function normalizeBearing(bearing: Degrees): Degrees {
  return (bearing + 360) % 360;
}

/**
 * Normalize longitude value to [-180, 180] degrees
 * @param longitude Longitude in degrees
 * @returns Normalized longitude
 */
export function normalizeLongitude(
  longitude: Coordinates["longitude"]
): Coordinates["longitude"] {
  return ((longitude + 540) % 360) - 180;
}

/**
 * The haversine formula.
 * @param theta The central angle between two points.
 * @returns The haversine.
 */
function hav(theta: Radians) {
  return Math.sin(theta / 2) ** 2;
}

/**
 * The archaversine formula.
 * @param h The haversine
 * @returns The central angle between two points.
 */
function archav(h: number) {
  return Math.acos(1 - 2 * h);
}
/**
 * Calculate the shortest distance between two locations.
 * @param loc1 Coordinates of first location.
 * @param loc2 Coordinates of second location.
 * @returns Shortest distance between the two locations, in kilometers.
 */
export function getDistance(loc1: Coordinates, loc2: Coordinates) {
  const lonDelta = degToRad(loc2.longitude - loc1.longitude);
  const lat1 = degToRad(loc1.latitude);
  const lat2 = degToRad(loc2.latitude);
  const latDelta = lat2 - lat1;
  // TODO: Beware of floating point errors here
  const h = hav(latDelta) + Math.cos(lat1) * Math.cos(lat2) * hav(lonDelta);

  return 2 * R * Math.asin(Math.sqrt(h));
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

  return normalizeBearing(radToDeg(theta));
}

/**
 * Return a destination point, vigen starting location, starting bearing,
 * and distance.
 * @param location Coordinates of starting location.
 * @param bearing Bearing from start point.
 * @param distance Distance to travel in km.
 * @returns Destination point.
 */
export function getDestination(
  location: Coordinates,
  heading: Degrees,
  distance: number
): Coordinates {
  const lat = degToRad(location.latitude);
  const lon = degToRad(location.longitude);
  const theta = degToRad(heading);

  const destLat = Math.asin(
    Math.sin(lat) * Math.cos(distance / R) +
      Math.cos(lat) * Math.sin(distance / R) * Math.cos(theta)
  );
  const destLon =
    lon +
    Math.atan2(
      Math.sin(theta) * Math.sin(distance / R) * Math.cos(lat),
      Math.cos(distance / R) - Math.sin(lat) * Math.sin(destLat)
    );

  return {
    latitude: radToDeg(destLat),
    longitude: normalizeLongitude(radToDeg(destLon)),
  };
}

/**
 * Get the half-way point along a great circle path between the two points.
 * @param loc1 Coordinates of first location.
 * @param loc2 Coordinates of second location.
 * @returns The latitude and longitude of the midpoint.
 */
export function getMidpoint(loc1: Coordinates, loc2: Coordinates): Coordinates {
  const lat1 = degToRad(loc1.latitude);
  const lat2 = degToRad(loc2.latitude);
  const lon1 = degToRad(loc1.longitude);
  const lon2 = degToRad(loc2.longitude);

  const Bx = Math.cos(lat2) * Math.cos(lon2 - lon1);
  const By = Math.cos(lat2) * Math.sin(lon2 - lon1);

  const latitudeRad = Math.atan2(
    Math.sin(lat1) + Math.sin(lat2),
    Math.sqrt(Math.cos(lat1) + Bx) * (Math.cos(lat1) + Bx) + By ** 2
  );
  const longitudeRad = lon1 + Math.atan2(By, Math.cos(lat1) + Bx);

  return {
    latitude: radToDeg(latitudeRad),
    longitude: normalizeLongitude(radToDeg(longitudeRad)),
  };
}

/**
 * Get the central angle between the two points.
 * @param loc1 Coordinates of first location.
 * @param loc2 Coordinates of second location.
 * @returns The central angle between the two coordinates
 */
export function getCentralAngle(loc1: Coordinates, loc2: Coordinates): Degrees {
  const lat1 = degToRad(loc1.latitude);
  const lat2 = degToRad(loc2.latitude);
  const latDelta = lat2 - lat1;
  const lon1 = degToRad(loc1.longitude);
  const lon2 = degToRad(loc2.longitude);
  const lonDelta = lon2 - lon1;

  return radToDeg(
    archav(
      hav(latDelta) + (1 - hav(latDelta) - hav(lat1 + lat2)) * hav(lonDelta)
    )
  );
}
