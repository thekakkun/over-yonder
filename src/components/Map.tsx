import {
  ExtendedFeatureCollection,
  geoAzimuthalEquidistant,
  geoPath,
} from "d3-geo";
import { select } from "d3-selection";
import { useEffect, useRef, useState } from "react";
import colors from "tailwindcss/colors";

import { CompletedLocation } from "../types/game";
import { getBearing } from "../utilities/cartography";

interface MapProps {
  target: CompletedLocation;
  location: GeolocationCoordinates;
}

export default function Map({ target, location }: MapProps) {
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
        .fitSize([svgSize.width, svgSize.width], geoJson)
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
        .attr("d", geoGenerator as any); // #TODO: Figure out correct typing for this.
    }
  }
  useEffect(() => {
    drawMap();
  }, [geoJson, svgSize]);

  return <svg ref={svgRef} id="map" className="h-full"></svg>;
}
