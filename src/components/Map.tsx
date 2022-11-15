import {
  ExtendedFeatureCollection,
  geoAzimuthalEquidistant,
  geoPath,
} from "d3-geo";
import { useEffect, useRef } from "react";
import colors from "tailwindcss/colors";

import geoJson from "../assets/data/ne_50m_admin_0_countries.json";
import { Coordinates } from "../types/cartography";
import { CompletedLocation } from "../types/game";
import { getBearing, getDestination } from "../utilities/cartography";
import MapElement from "./MapElement";

interface MapProps {
  target: CompletedLocation;
  location: Coordinates;
}

export default function Map({ target, location }: MapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  let projection = geoAzimuthalEquidistant().rotate([
    -location.longitude,
    -location.latitude,
    getBearing(location, target),
  ]);
  useEffect(() => {
    if (svgRef.current) {
      projection.fitSize(
        [svgRef.current.clientWidth, svgRef.current.clientHeight],
        geoJson as ExtendedFeatureCollection
      );
    }
  }, [svgRef]);

  const guessDest = getDestination(location, target.heading, 5000);
  const geoGenerator = geoPath(projection);

  return (
    <svg ref={svgRef} id="map" className="h-full">
      <MapElement
        svg={{
          fill: colors.blue[100],
          d:
            geoGenerator({
              type: "Sphere",
            }) ?? "",
        }}
      ></MapElement>
      <MapElement
        svg={(geoJson as ExtendedFeatureCollection).features.map((feature) => {
          return {
            stroke: colors.slate[800],
            fill: colors.stone[100],
            d: geoGenerator(feature) ?? "",
          };
        })}
      ></MapElement>
      <MapElement
        svg={{
          stroke: colors.red[500],
          strokeWidth: 3,
          fill: undefined,
          d:
            geoGenerator({
              type: "LineString",
              coordinates: [
                [location.longitude, location.latitude],
                [target.longitude, target.latitude],
              ],
            }) ?? "",
        }}
      ></MapElement>
      <MapElement
        svg={{
          stroke: colors.green[500],
          strokeWidth: 3,
          fill: undefined,
          d:
            geoGenerator({
              type: "LineString",
              coordinates: [
                [location.longitude, location.latitude],
                [guessDest.longitude, guessDest.latitude],
              ],
            }) ?? "",
        }}
      ></MapElement>
    </svg>
  );
}
