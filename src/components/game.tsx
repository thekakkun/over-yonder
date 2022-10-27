import React, { useState } from "react";
import { Coordinates } from "../utilities/cartography";

export default function Game() {
  const [coords, setCoords] = useState<Coordinates>({
    latitude: 0,
    longitude: 0,
  });
  const watchId = navigator.geolocation.watchPosition((position) => {
    setCoords(position.coords);
  });

  return (
    <p>
      {coords.latitude}, {coords.longitude}
    </p>
  );
}
