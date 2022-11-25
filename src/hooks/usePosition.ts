import { useEffect, useState } from "react";
import { Position } from "../types/game";

interface WebkitDeviceOrientationEvent extends DeviceOrientationEvent {
  webkitCompassHeading: number;
}

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
  function geoErrorHandler(error: GeolocationPositionError) {
    alert(`ERROR(${error.code}): ${error.message}`);
  }
  useEffect(() => {
    if ("geolocation" in navigator) {
      let watchId = navigator.geolocation.watchPosition(
        setCoordinates,
        geoErrorHandler
      );

      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, []);

  function setHeading(
    orientation: DeviceOrientationEvent | WebkitDeviceOrientationEvent
  ) {
    if ("webkitCompassHeading" in orientation) {
      setPosition({
        ...position,
        heading: orientation.webkitCompassHeading,
      });
    } else if (orientation.absolute && orientation.alpha !== null) {
      setPosition({
        ...position,
        heading: 359 - orientation.alpha,
      });
    }
  }

  useEffect(() => {
    if ("ondeviceorientationabsolute" in window) {
      window.addEventListener<"deviceorientation">(
        "deviceorientationabsolute" as "deviceorientation",
        setHeading
      );
      return () =>
        window.removeEventListener<"deviceorientation">(
          "deviceorientationabsolute" as "deviceorientation",
          setHeading
        );
    } else if ("ondeviceorientation" in window) {
      window.addEventListener("deviceorientation", setHeading);
      return () => window.removeEventListener("deviceorientation", setHeading);
    }
  }, []);

  return position;
}
