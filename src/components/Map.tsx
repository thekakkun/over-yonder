import {
  ExtendedFeatureCollection,
  geoAzimuthalEquidistant,
  geoPath,
} from "d3-geo";
import { select } from "d3-selection";
import { useEffect, useRef, useState } from "react";
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
  // useEffect(() => {
  //   if (geoJson) {
  //     const svg = select("#map");
  //     svg.selectAll("*").remove();

  //     const globePath = svg
  //       .append("path")
  //       .attr("fill", colors.blue[100])
  //       .attr(
  //         "d",
  //         geoGenerator({
  //           type: "Sphere",
  //         })
  //       );

  //     // const mapGroup = svg
  //     //   .append("g")
  //     //   .attr("fill", colors.stone[100])
  //     //   .attr("stroke", colors.slate[800])
  //     //   .selectAll("path")
  //     //   .data((geoJson as ExtendedFeatureCollection).features)
  //     //   .enter()
  //     //   .append("path")
  //     //   .attr("d", (d) => geoGenerator(d));

  //     const targetPath = svg
  //       .append("path")
  //       .attr("fill-opacity", 0)
  //       .attr("stroke", colors.red[500])
  //       .attr("stroke-width", "3px")
  //       .attr(
  //         "d",
  //         geoGenerator({
  //           type: "LineString",
  //           coordinates: [
  //             [location.longitude, location.latitude],
  //             [target.longitude, target.latitude],
  //           ],
  //         })
  //       );

  //     const guessDest = getDestination(location, target.heading, 5000);
  //     // const guessPath = svg
  //     //   .append("path")
  //     //   .attr("fill-opacity", 0)
  //     //   .attr("stroke", colors.green[500])
  //     //   .attr("stroke-width", "3px")
  //     //   .attr(
  //     //     "d",
  //     //     geoGenerator({
  //     //       type: "LineString",
  //     //       coordinates: [
  //     //         [location.longitude, location.latitude],
  //     //         [guessDest.longitude, guessDest.latitude],
  //     //       ],
  //     //     })
  //     //   );
  //   }
  // }, [location, target, projection]);

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
