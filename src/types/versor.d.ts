declare module "versor" {
  export as namespace versor;

  export = versor;

  declare function versor(
    e: [number, number, number]
  ): [number, number, number, number];

  declare namespace versor {
    export function cartesian(e: [number, number]): [number, number, number];

    export function rotation(
      e: [number, number, number, number]
    ): [number, number, number];

    export function delta(
      v0: [number, number, number],
      v1: [number, number, number],
      alpha?: number
    ): [number, number, number, number];

    export function multiply(
      q0: [number, number, number, number],
      q1: [number, number, number, number]
    ): [number, number, number, number];

    function cross(
      v0: [number, number, number],
      v1: [number, number, number]
    ): [number, number, number];

    function dot(
      v0: [number, number, number],
      v1: [number, number, number]
    ): number;
  }
}
