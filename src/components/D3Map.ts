// @ts-nocheck
import { drag } from "d3-drag";
import {
  ExtendedFeatureCollection,
  geoOrthographic,
  GeoPath,
  geoPath,
  GeoProjection,
} from "d3-geo";
import { pointers, select, Selection } from "d3-selection";
import versor from "versor";

import geoJson from "../assets/data/ne_110m_admin_0_countries.json";
import { Coordinates } from "../types/cartography";
import { CompletedLocation } from "../types/game";
import { getBearing, getDestination } from "../utilities/cartography";

/**
 * Draw a map, using D3 in the specified element.
 */
export default class D3Map {
  svg: Selection<SVGSVGElement, unknown, null, undefined>;
  target: CompletedLocation;
  destination: Coordinates;
  location: Coordinates;
  projection: GeoProjection;
  geoGenerator: GeoPath;

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
    this.destination = getDestination(this.location, this.target.heading, 5000);

    this.projection = geoOrthographic()
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

    this.drag = this.drag.bind(this);
    this.svg
      .call(this.drag().on("drag.render", () => this.draw()))
      .call(() => this.draw());
  }

  /** Draw the map. */
  draw() {
    this.svg.select("#globe").attr(
      "d",
      this.geoGenerator({
        type: "Sphere",
      })
    );

    const u = this.svg
      .select("#countries")
      .selectAll("path")
      .data((geoJson as ExtendedFeatureCollection).features);
    u.enter().append("path").merge(u).attr("d", this.geoGenerator);

    this.svg.select("#destLine").attr(
      "d",
      this.geoGenerator({
        type: "LineString",
        coordinates: [
          [this.location.longitude, this.location.latitude],
          [this.target.longitude, this.target.latitude],
        ],
      })
    );

    this.svg.select("#guessLine").attr(
      "d",
      this.geoGenerator({
        type: "LineString",
        coordinates: [
          [this.location.longitude, this.location.latitude],
          [this.destination.longitude, this.destination.latitude],
        ],
      })
    );
  }

  drag() {
    let v0, q0, r0, a0, l;

    const pointer = (event) => {
      const t = pointers(event, this.svg);

      if (t.length !== l) {
        l = t.length;
        if (l > 1) a0 = Math.atan2(t[1][1] - t[0][1], t[1][0] - t[0][0]);
        dragStarted(event);
      }

      // For multitouch, average positions and compute rotation.
      if (l > 1) {
        const x = t.reduce((acc, curr) => acc + curr[0], 0);
        const y = t.reduce((acc, curr) => acc + curr[1], 0);

        const a = Math.atan2(t[1][1] - t[0][1], t[1][0] - t[0][0]);
        return [x, y, a];
      }

      return t[0];
    };

    const dragStarted = (event) => {
      v0 = versor.cartesian(this.projection.invert(pointer(event)));
      q0 = versor((r0 = this.projection.rotate()));
    };

    const dragged = (event) => {
      const p = pointer(event, this);
      const v1 = versor.cartesian(this.projection.rotate(r0).invert(p));
      const delta = versor.delta(v0, v1);
      let q1 = versor.multiply(q0, delta);

      // For multitouch, compose with a rotation around the axis.
      if (p[2]) {
        const d = (p[2] - a0) / 2;
        const s = -Math.sin(d);
        const c = Math.sign(Math.cos(d));
        q1 = versor.multiply([Math.sqrt(1 - s * s), 0, 0, c * s], q1);
      }

      this.projection.rotate(versor.rotation(q1));

      // In vicinity of the antipode (unstable) of q0, restart.
      if (delta[0] < 0.7) {
        dragStarted(event);
      }
    };

    return drag().on("start", dragStarted).on("drag", dragged);
  }
}
