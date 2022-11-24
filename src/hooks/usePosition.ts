import { useEffect, useState } from "react";
import { Position } from "../types/game";

export default function usePosition() {
  let initPosition: Position =
    process.env.NODE_ENV === "development"
      ? {
          coordinates: {
            latitude: 43.6532,
            longitude: -79.3832,
          },
          heading: 30,
        }
      : {
          coordinates: null,
          heading: null,
        };

  const [position, setPosition] = useState(initPosition);

  function setCoordinates(pos: GeolocationPosition) {
    setPosition({ ...position, coordinates: pos.coords });
  }
  useEffect(() => {
    if ("geolocation" in navigator) {
      let watchId = navigator.geolocation.watchPosition(
        setCoordinates,
        (error) => {
          alert(`ERROR(${error.code}): ${error.message}`);
        }
      );

      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, []);

  function setHeading(orientation: DeviceOrientationEvent | Event) {
    if ("webkitCompassHeading" in orientation) {
      setPosition({
        ...position,
        heading: (orientation as any).webkitCompassHeading,
      });
    } else if ("absolute" in orientation && orientation.absolute) {
      if ("alpha" in orientation && orientation.alpha !== null) {
        setPosition({ ...position, heading: 359 - orientation.alpha });
      }
    }
  }
  useEffect(() => {
    if ("ondeviceorientationabsolute" in window) {
      window.addEventListener("deviceorientationabsolute", setHeading);
      return () =>
        window.removeEventListener("deviceorientationabsolute", setHeading);
    } else if ("ondeviceorientation" in window) {
      window.addEventListener("deviceorientation", setHeading);
      return () => window.removeEventListener("deviceorientation", setHeading);
    }
  }, []);

  return position;
}
