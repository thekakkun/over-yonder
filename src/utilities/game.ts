import { CurrentLocation } from "../types/game";
import { getBearing } from "./cartography";
import { getRandomInt } from "./math";

export function getLocation(): CurrentLocation {
  const locations = [
    {
      location: "Tokyo",
      coordinates: { latitude: 35.6839, longitude: 139.7744 },
    },
    {
      location: "Jakarta",
      coordinates: { latitude: -6.2146, longitude: 106.8451 },
    },
    {
      location: "Delhi",
      coordinates: { latitude: 28.6667, longitude: 77.2167 },
    },
    {
      location: "Manila",
      coordinates: { latitude: 14.6, longitude: 120.9833 },
    },
    {
      location: "Sao Paulo",
      coordinates: { latitude: -23.5504, longitude: -46.6339 },
    },
    {
      location: "Seoul",
      coordinates: { latitude: 37.56, longitude: 126.99 },
    },
    {
      location: "Mumbai",
      coordinates: { latitude: 19.0758, longitude: 72.8775 },
    },
    {
      location: "Shanghai",
      coordinates: { latitude: 31.1667, longitude: 121.4667 },
    },
    {
      location: "Mexico City",
      coordinates: { latitude: 19.4333, longitude: -99.1333 },
    },
    {
      location: "Guangzhou",
      coordinates: { latitude: 23.1288, longitude: 113.259 },
    },
    {
      location: "Cairo",
      coordinates: { latitude: 30.0444, longitude: 31.2358 },
    },
    {
      location: "Beijing",
      coordinates: { latitude: 39.904, longitude: 116.4075 },
    },
    {
      location: "New York",
      coordinates: { latitude: 40.6943, longitude: -73.9249 },
    },
    {
      location: "Kolkata",
      coordinates: { latitude: 22.5727, longitude: 88.3639 },
    },
    {
      location: "Moscow",
      coordinates: { latitude: 55.7558, longitude: 37.6178 },
    },
    {
      location: "Bangkok",
      coordinates: { latitude: 13.75, longitude: 100.5167 },
    },
    {
      location: "Dhaka",
      coordinates: { latitude: 23.7289, longitude: 90.3944 },
    },
    {
      location: "Buenos Aires",
      coordinates: { latitude: -34.5997, longitude: -58.3819 },
    },
    {
      location: "Osaka",
      coordinates: { latitude: 34.752, longitude: 135.4582 },
    },
    {
      location: "Lagos",
      coordinates: { latitude: 6.45, longitude: 3.4 },
    },
  ];
  const i = getRandomInt(0, locations.length);
  return locations[i];
}

export function getScore(
  location: GeolocationCoordinates,
  current: CurrentLocation
) {
  return Math.round(
    ((Math.abs(
      getBearing(location, current.coordinates) - (location.heading as number)
    ) %
      181) /
      180) *
      200
  );
}
