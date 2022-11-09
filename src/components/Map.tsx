import {
  ExtendedFeatureCollection,
  geoAzimuthalEquidistant,
  GeoGeometryObjects,
  geoPath,
} from "d3-geo";
import { select } from "d3-selection";
import { useCallback, useEffect, useRef, useState } from "react";
import colors from "tailwindcss/colors";
import { Coordinates } from "../types/cartography";

import { CompletedLocation } from "../types/game";
import { Degrees } from "../types/math";
import { getBearing, getDestination } from "../utilities/cartography";

interface MapProps {
  target: CompletedLocation;
  location: Coordinates;
  heading: Degrees;
}

export default function Map({ target, location, heading }: MapProps) {
  const [geoJson, setGeoJson] = useState<ExtendedFeatureCollection | null>(
    null
  );

  useEffect(() => {
    async function getData() {
      let response = await fetch("/ne_50m_admin_0_countries.json");
      if (response.ok) {
        let json = await response.json();
        setGeoJson(json);
      } else {
        throw new Error(`Error ${response.status}: GeoJSON file not found.`);
      }
    }

    getData();
  }, []);

  const [svgSize, setSvgSize] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });
  const svgRef = useRef<SVGSVGElement>(null);
  useEffect(() => {
    if (svgRef.current) {
      setSvgSize({
        height: svgRef.current.clientHeight,
        width: svgRef.current.clientWidth,
      });
    } else {
      throw Error("svgRef is not assigned");
    }
  }, [svgRef]);

  function drawMap() {
    if (geoJson) {
      const projection = geoAzimuthalEquidistant()
        .fitSize([svgSize.width, svgSize.height], geoJson)
        .rotate([
          -location.longitude,
          -location.latitude,
          getBearing(location, target.coordinates),
        ]);

      const geoGenerator = geoPath(projection);

      const svg = select("#map");
      svg.selectAll("*").remove();

      const mapG = svg
        .append("g")
        .attr("fill", colors.slate[50])
        .attr("stroke", colors.slate[900]);
      mapG
        .selectAll("path")
        .data(geoJson.features)
        .enter()
        .append("path")
        .attr("d", (d) => geoGenerator(d));

      const targetLine: GeoGeometryObjects = {
        type: "LineString",
        coordinates: [
          [location.longitude, location.latitude],
          [target.coordinates.longitude, target.coordinates.latitude],
        ],
      };
      const targetPath = svg
        .append("path")
        .attr("fill-opacity", 0)
        .attr("stroke", colors.red[500])
        .attr("stroke-width", "3px");
      targetPath.attr("d", geoGenerator(targetLine));

      const guessDest = getDestination(location, heading, 5000);
      const guessLine: GeoGeometryObjects = {
        type: "LineString",
        coordinates: [
          [location.longitude, location.latitude],
          [guessDest.longitude, guessDest.latitude],
        ],
      };
      const guessPath = svg
        .append("path")
        .attr("fill-opacity", 0)
        .attr("stroke", colors.green[500])
        .attr("stroke-width", "3px");
      guessPath.attr("d", geoGenerator(guessLine));
    }
  }

  useCallback(drawMap, [geoJson, svgSize]);

  return <svg ref={svgRef} id="map" className="h-full"></svg>;
}
