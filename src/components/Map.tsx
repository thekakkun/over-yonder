import {
  ExtendedFeatureCollection,
  geoAzimuthalEquidistant,
  geoPath,
} from "d3-geo";
import { select } from "d3-selection";
import { zoom } from "d3-zoom";

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
  }, [svgRef, projection]);

  const guessDest = getDestination(location, target.heading, 5000);
  const geoGenerator = geoPath(projection);

  const globeData = {
    fill: colors.blue[100],
    d:
      geoGenerator({
        type: "Sphere",
      }) ?? "",
  };

  const countriesData = (geoJson as ExtendedFeatureCollection).features.map(
    (feature) => {
      return {
        stroke: colors.slate[800],
        fill: colors.stone[100],
        d: geoGenerator(feature) ?? "",
      };
    }
  );

  const destLineData = {
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
  };
  const guessLineData = {
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
  };

  function handleZoom(e: any) {
    select("#map").selectChildren().attr("transform", e.transform);
  }
  useEffect(() => {
    let zoomBehavior = zoom<SVGSVGElement, unknown>().on("zoom", handleZoom);
    select<SVGSVGElement, unknown>("#map").call(zoomBehavior);
  }, []);

  return (
    <div className="h-full">
      <svg ref={svgRef} id="map" className="h-full w-full">
        <MapElement svg={globeData}></MapElement>
        <MapElement svg={countriesData}></MapElement>
        <MapElement svg={destLineData}></MapElement>
        <MapElement svg={guessLineData}></MapElement>
      </svg>
    </div>
  );
}
