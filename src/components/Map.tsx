import { CompletedLocation } from "../types/game";
import { geoAzimuthalEqualArea, geoEquirectangular, geoPath } from "d3-geo";
import { useEffect } from "react";
import { select } from "d3";
import geojson from "../data/ne_50m_admin_0_countries.json";
import { getBearing } from "../utilities/cartography";

interface MapProps {
  target: CompletedLocation;
  location: GeolocationCoordinates;
}
export default function Map({ target, location }: MapProps) {
  let projection = geoAzimuthalEqualArea().rotate([
    -location.longitude,
    -location.latitude,
    getBearing(location, target.coordinates),
  ]);
  let geoGenerator = geoPath().projection(projection);

  geoGenerator({
    type: "Feature",
    properties: {},
    geometry: {
      type: "LineString",
      coordinates: [
        [location.longitude, location.latitude],
        [target.coordinates.longitude, target.coordinates.latitude],
      ],
    },
  });

  useEffect(() => {
    let u = select("#map").selectAll("path").data(geojson.features);
    u.enter()
      .append("path")
      .attr("d", geoGenerator as any); // #TODO: Figure out correct typing for this.
  }, []);

  return (
    <svg className="h-full fill-slate-50 stroke-slate-900">
      <g id="map"></g>
    </svg>
  );
}
