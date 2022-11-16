import { mean } from "d3-array";
import {
  ExtendedFeatureCollection,
  geoOrthographic,
  geoPath,
  GeoPath,
  GeoProjection,
} from "d3-geo";
import { pointers, select, Selection } from "d3-selection";
import { zoom, ZoomBehavior, zoomIdentity } from "d3-zoom";
import { useEffect, useRef } from "react";
import colors from "tailwindcss/colors";
import versor from "versor";

import geoJson from "../assets/data/ne_50m_admin_0_countries.json";
import { Coordinates, VersorGeoProjection } from "../types/cartography";
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
  projection: VersorGeoProjection | GeoProjection;
  geoGenerator: GeoPath;
  // zoomBehavior: ZoomBehavior<SVGSVGElement, unknown>;

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

    this.projection = geoOrthographic()
      .rotate([
        -this.location.longitude,
        -this.location.latitude,
        0,
        // getBearing(location, target),
      ])
      .fitSize(
        [containerEl.clientWidth, containerEl.clientHeight],
        geoJson as ExtendedFeatureCollection
      );
    this.geoGenerator = geoPath(this.projection);
    // this.zoomBehavior = zoom();

    this.draw();
    this.initZoom();
    // this.zoomToElem(select("#destLine"));
  }

  zoom(
    projection: VersorGeoProjection,
    {
      scale = projection._scale === undefined
        ? (projection._scale = projection.scale())
        : projection._scale,
      scaleExtent = [0.8, 8],
    }: { scale?: number; scaleExtent?: [number, number] } = {}
  ) {
    let v0: [number, number, number],
      q0: [number, number, number, number],
      r0: [number, number, number],
      a0: number,
      tl: number;

    function point(
      event: any,
      that: any
    ): [number, number] | [number, number, number] {
      const t = pointers(event, that);

      if (t.length !== tl) {
        tl = t.length;
        if (tl > 1) {
          a0 = Math.atan2(t[1][1] - t[0][1], t[1][0] - t[0][0]);
        }
        zoomStarted.call(that, event);
      }

      return tl > 1
        ? [
            mean(t, (p) => p[0]) as number,
            mean(t, (p) => p[1]) as number,
            Math.atan2(t[1][1] - t[0][1], t[1][0] - t[0][0]),
          ]
        : t[0];
    }

    const zoomStarted = (event: any) => {
      if (projection.invert) {
        v0 = versor.cartesian(
          projection.invert(point(event, this) as [number, number]) as [
            number,
            number
          ]
        );
      } else {
        throw new Error("projection.invert is null");
      }
      q0 = versor((r0 = projection.rotate()));
    };

    const zoomed = (event: any) => {
      projection.scale(event.transform.k);
      const pt = point(event, this);
      const rotatedProjection = projection.rotate(r0);
      if (rotatedProjection.invert) {
        const v1 = versor.cartesian(
          rotatedProjection.invert(pt as [number, number]) as [number, number]
        );
        const delta = versor.delta(v0, v1);
        let q1 = versor.multiply(q0, delta);
        if (pt[2]) {
          const d = (pt[2] - a0) / 2;
          const s = -Math.sin(d);
          const c = Math.sign(Math.cos(d));
          q1 = versor.multiply([Math.sqrt(1 - s * s), 0, 0, c * s], q1);
        }

        projection.rotate(versor.rotation(q1));

        // In vicinity of the antipode (unstable) of q0, restart.
        if (delta[0] < 0.7) {
          zoomStarted.call(this, event);
        }
      } else {
        throw new Error("projection.invert is null");
      }

      // For multitouch, compose with a rotation around the axis.
    };

    const zoomBehavior = zoom()
      .scaleExtent(scaleExtent.map((x) => x * scale) as typeof scaleExtent)
      .on("start", zoomStarted)
      .on("zoom", zoomed);

    return Object.assign(
      (selection: any) =>
        selection
          .property("__zoom", zoomIdentity.scale(projection.scale()))
          .call(zoomBehavior),
      {
        // @ts-ignore
        on(type: string, ...options) {
          return options.length
            ? // @ts-ignore
              (zoomBehavior.on(type, ...options), this)
            : zoomBehavior.on(type);
        },
      }
    );
  }

  /** Attach zoom behavior on target svg. */
  initZoom() {
    this.svg.call(this.zoom(this.projection as VersorGeoProjection));
  }

  // zoomToElem(element: Selection<BaseType, unknown, HTMLElement, any>) {
  //   const containerEl = this.svg.node();
  //   if (containerEl !== null) {
  //     const { clientHeight, clientWidth } = containerEl;
  //     const { height, width, x, y } = containerEl.getBBox();
  //     this.svg.call(
  //       this.zoomBehavior.transform,
  //       zoomIdentity.translate(0, 0).scale(1)
  //     );
  //   }
  // }

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
