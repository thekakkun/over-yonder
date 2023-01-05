import { useEffect, useState } from "react";
import { Coordinates } from "../types/cartography";
import { Position } from "../types/game";
import { Degrees } from "../types/math";

interface WebkitDeviceOrientationEvent extends DeviceOrientationEvent {
  webkitCompassHeading: number;
}

export default function usePosition(): Position {
  let coordinates = useCoordinates();
  let heading = useHeading();

  if (process.env.NODE_ENV === "development") {
    coordinates = {
      latitude: 43.6532,
      longitude: -79.3832,
    };
    heading = 30;
  }

  return { coordinates, heading };
}

function useCoordinates(): Coordinates | null {
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      let watchId = navigator.geolocation.watchPosition(
        (pos) => setCoordinates(pos.coords),
        (error) => alert(`ERROR(${error.code}): ${error.message}`)
      );

      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, []);

  return coordinates;
}

function useHeading(): Degrees | null {
  const [heading, setHeading] = useState<Degrees | null>(null);

  function orientationHandler(
    orientation: DeviceOrientationEvent | WebkitDeviceOrientationEvent
  ) {
    if ("webkitCompassHeading" in orientation) {
      setHeading(orientation.webkitCompassHeading);
    } else if (orientation.absolute && orientation.alpha !== null) {
      setHeading(359 - orientation.alpha);
    }
  }

  useEffect(() => {
    if ("ondeviceorientationabsolute" in window) {
      window.addEventListener(
        "deviceorientationabsolute" as "deviceorientation",
        orientationHandler
      );
      return () =>
        window.removeEventListener(
          "deviceorientationabsolute" as "deviceorientation",
          orientationHandler
        );
    } else if ("ondeviceorientation" in window) {
      window.addEventListener("deviceorientation", orientationHandler);
      return () =>
        window.removeEventListener("deviceorientation", orientationHandler);
    }
  }, []);

  return heading;
}
