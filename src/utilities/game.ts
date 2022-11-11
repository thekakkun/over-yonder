import { Coordinates } from "../types/cartography";
import { CurrentLocation, StageList } from "../types/game";
import { Degrees } from "../types/math";
import { getBearing } from "./cartography";
import { getRandomInt } from "./math";
import cities from "../assets/data/cities.json";

export function getScore(
  location: Coordinates,
  heading: Degrees,
  target: CurrentLocation
) {
  if (heading === null) {
    throw Error("Heading not available");
  }

  const bearing = getBearing(location, target.coordinates);
  const degreeDelta = Math.min(
    Math.abs(bearing - heading),
    360 - Math.abs(bearing - heading)
  );

  return Math.round(200 * (1 - degreeDelta / 180));
}

export function getLocation(exclude: StageList = []): CurrentLocation {
  let candidate: {
    // # TODO: I don't like how I'm doing this
    city: string;
    country: string;
    lat: number;
    lng: number;
  };

  while (true) {
    candidate = cities[getRandomInt(0, cities.length)];

    if (
      exclude.filter(
        ({ location }) =>
          location.country === candidate.country &&
          location.city === candidate.city
      )
    ) {
      continue;
    }

    return {
      location: {
        city: candidate.city,
        country: candidate.country,
      },
      coordinates: {
        latitude: candidate.lat,
        longitude: candidate.lng,
      },
    };
  }
}

export function getHeading(event: DeviceOrientationEvent): Degrees | null {
  console.log(event.type);
  if ("webkitCompassHeading" in event) {
    return (event as any).webkitCompassHeading as Degrees;
  } else if (!event.absolute) {
    return null;
  } else if (event.alpha !== null) {
    return 359 - event.alpha;
  } else {
    return null;
  }
}
