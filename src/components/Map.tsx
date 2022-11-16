import {
  ExtendedFeatureCollection,
  geoAzimuthalEquidistant,
  geoPath,
  GeoPath,
  GeoProjection,
} from "d3-geo";
import { BaseType, select, Selection } from "d3-selection";
import { zoom, ZoomBehavior, zoomIdentity } from "d3-zoom";
import { useEffect, useRef } from "react";
import colors from "tailwindcss/colors";

import geoJson from "../assets/data/ne_50m_admin_0_countries.json";
import { Coordinates } from "../types/cartography";
import { CompletedLocation } from "../types/game";
import { getBearing, getDestination } from "../utilities/cartography";

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

/**
 * Draw a map, using D3 in the specified element.
 */
class D3Map {
  svg: Selection<SVGSVGElement, unknown, null, undefined>;
  target: CompletedLocation;
  location: Coordinates;
  projection: GeoProjection;
  geoGenerator: GeoPath;
  zoomBehavior: ZoomBehavior<SVGSVGElement, unknown>;

  /**
   * Create a D3Map object.
   * @param containerEl The element to draw the map on.
   * @param target Target location for stage.
   * @param location User's current location.
   */
  constructor(
    containerEl: SVGSVGElement,
    target: CompletedLocation,
    location: Coordinates
  ) {
    this.svg = select(containerEl);
    this.target = target;
    this.location = location;

    this.projection = geoAzimuthalEquidistant()
      .rotate([
        -this.location.longitude,
        -this.location.latitude,
        getBearing(location, target),
      ])
      .fitSize(
        [containerEl.clientWidth, containerEl.clientHeight],
        geoJson as ExtendedFeatureCollection
      );
    this.geoGenerator = geoPath(this.projection);
    this.zoomBehavior = zoom();

    this.draw();
    this.initZoom();
    this.zoomToElem(select("#destLine"));
  }

  /** Attach zoom behavior on target svg. */
  initZoom() {
    this.zoomBehavior.on("zoom", (e: any) =>
      this.svg.selectChildren().attr("transform", e.transform)
    );
    this.svg.call(this.zoomBehavior);
  }

  zoomToElem(element: Selection<BaseType, unknown, HTMLElement, any>) {
    const containerEl = this.svg.node();
    if (containerEl !== null) {
      const { clientHeight, clientWidth } = containerEl;
      const { height, width, x, y } = containerEl.getBBox();
      this.svg.call(
        this.zoomBehavior.transform,
        zoomIdentity.translate(0, 0).scale(1))
    }
  }

  /** Draw the map. */
  draw() {
    this.svg.selectChildren().remove();
    this.drawGlobe();
    this.drawCountries();
    this.drawDest();
    this.drawGuess();
  }

  /** Draw the globe background. */
  drawGlobe() {
    this.svg
      .append("path")
      .attr("fill", colors.blue[100])
      .attr(
        "d",
        this.geoGenerator({
          type: "Sphere",
        })
      );
  }

  /** Draw the countries. */
  drawCountries() {
    this.svg
      .append("g")
      .attr("fill", colors.stone[100])
      .attr("stroke", colors.slate[800])
      .selectAll("path")
      .data((geoJson as ExtendedFeatureCollection).features)
      .enter()
      .append("path")
      .attr("d", this.geoGenerator);
  }

  /** Draw the destination line. */
  drawDest() {
    this.svg
      .append("path")
      .attr("id", "destLine")
      .attr("fill", null)
      .attr("stroke", colors.red[500])
      .attr("stroke-width", "3px")
      .attr(
        "d",
        this.geoGenerator({
          type: "LineString",
          coordinates: [
            [this.location.longitude, this.location.latitude],
            [this.target.longitude, this.target.latitude],
          ],
        })
      );
  }

  /** Draw the guess line */
  drawGuess() {
    const guessDest = getDestination(this.location, this.target.heading, 5000);
    this.svg
      .append("path")
      .attr("fill-opacity", 0)
      .attr("stroke", colors.green[500])
      .attr("stroke-width", "3px")
      .attr(
        "d",
        this.geoGenerator({
          type: "LineString",
          coordinates: [
            [this.location.longitude, this.location.latitude],
            [guessDest.longitude, guessDest.latitude],
          ],
        })
      );
  }
}
