import { useEffect, useRef } from "react";

import { Coordinates } from "../types/cartography";
import { CompletedLocation } from "../types/game";

import D3Map from "./D3Map";

interface MapProps {
  target: CompletedLocation;
  location: Coordinates;
}

let map: D3Map;

export default function Map({ target, location }: MapProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (svgRef.current) {
      map = new D3Map(svgRef.current, target, location);
    }
  }, [svgRef, target]);

  return (
    <div className="h-full">
      <svg ref={svgRef} id="map" className="h-full w-full"></svg>
    </div>
  );
}
