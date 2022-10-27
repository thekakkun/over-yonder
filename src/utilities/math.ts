export type Degrees = number;
export type Radians = number;

export function degToRad(degrees: Degrees): Radians {
  return degrees * (Math.PI / 180);
}

export function radToDeg(rad: Radians): Degrees {
  return rad / (Math.PI / 180);
}

export function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}
