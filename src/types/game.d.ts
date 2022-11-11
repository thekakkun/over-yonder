import { Dispatch } from "react";
import { Coordinates, Location } from "./cartography";
import { Degrees } from "./math";

// Game mode
export type Modes = "intro" | "guess" | "answer" | "outro";

// Stage stuff
export interface CurrentLocation extends Location, Coordinates {}

export interface Guess {
  heading: Degrees;
  score: number;
}

export interface CompletedLocation extends CurrentLocation, Guess {}

export type StageList = (CurrentLocation | CompletedLocation)[];

export type ActionType =
  | { type: "next"; payload: StageList }
  | { type: "reroll"; payload: StageList }
  | { type: "guess"; payload: Guess }
  | { type: "restart" };
