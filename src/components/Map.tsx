import { useEffect, useRef } from "react";
import colors from "tailwindcss/colors";

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
  }, [svgRef]);

  return (
    <div className="h-full">
      <svg ref={svgRef} id="map" className="h-full w-full">
        <path id="globe" fill={colors.blue[100]}></path>
        <g
          id="countries"
          fill={colors.stone[100]}
          stroke={colors.slate[800]}
        ></g>
        <g>
          <path
            id="destLine"
            fillOpacity={0}
            stroke={colors.red[500]}
            strokeLinecap="round"
            strokeWidth="2px"
          ></path>
          <path id="destPoint" fill={colors.red[600]}></path>
          <text
            id="destLabel"
            dominantBaseline="middle"
          >{`${target.city}, ${target.country}`}</text>
          <text cursor="default" fill={colors.red[800]}>
            <textPath href="#destLine" startOffset="10">
              Answer
            </textPath>
          </text>
        </g>
        <g>
          <path
            id="guessLine"
            fillOpacity={0}
            stroke={colors.green[500]}
            strokeLinecap="round"
            strokeWidth="2px"
          ></path>
          <text cursor="default" fill={colors.green[800]}>
            <textPath href="#guessLine" startOffset="10">
              Your guess
            </textPath>
          </text>
        </g>
      </svg>
    </div>
  );
}
