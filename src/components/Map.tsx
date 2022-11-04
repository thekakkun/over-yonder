import colors from "tailwindcss/colors";

import { CompletedLocation } from "../types/game";
import { ComposableMap, Geographies, Geography, Line } from "react-simple-maps";

const geoUrl =
  "https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json";

interface MapProps {
  target: CompletedLocation;
  location: GeolocationCoordinates;
}
export default function Map({ target, location }: MapProps) {
  return (
    <ComposableMap
      className="h-full"
      projection="geoAzimuthalEquidistant"
      projectionConfig={{
        rotate: [-location.longitude, -location.latitude, 0],
        scale: 300,
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
        to={[
          180 - Math.abs(target.coordinates.longitude),
          -target.coordinates.latitude,
        ]}
        stroke={colors.green[400]}
      ></Line>
    </ComposableMap>
  );
}
