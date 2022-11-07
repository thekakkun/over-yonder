import colors from "tailwindcss/colors";

import { CompletedLocation } from "../types/game";
import { ComposableMap, Geographies, Geography, Line } from "react-simple-maps";
import {
  getBearing,
  getCentralAngle,
  getMidpoint,
} from "../utilities/cartography";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface MapProps {
  target: CompletedLocation;
  location: GeolocationCoordinates;
}
export default function Map({ target, location }: MapProps) {
  const bearing = getBearing(location, target.coordinates);
  const midpoint = getMidpoint(target.coordinates, location);
  console.log(midpoint);

  return (
    <ComposableMap
      className="h-full border-2"
      projection="geoAzimuthalEquidistant"
      projectionConfig={{
        rotate: [-location.longitude, -location.latitude, bearing],
        center: [0, getCentralAngle(location, midpoint)],
        scale: 400,
      }}
    >
      <Geographies geography={geoUrl}>
        {({ geographies }) =>
          geographies.map((geo) => (
            <Geography
              key={geo.rsmKey}
              geography={geo}
              fill={colors.slate[100]}
              stroke={colors.slate[900]}
            />
          ))
        }
      </Geographies>
      <Line
        from={[location.longitude, location.latitude]}
        to={[target.coordinates.longitude, target.coordinates.latitude]}
        stroke={colors.red[400]}
      ></Line>
      <Line
        from={[location.longitude, location.latitude]}
        to={[180 - Math.abs(location.longitude), -location.latitude]}
        stroke={colors.green[400]}
      ></Line>
    </ComposableMap>
  );
}
