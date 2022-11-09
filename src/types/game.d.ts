import { Dispatch } from "react";
import { Coordinates } from "./cartography";

// Game mode
export type Modes = "intro" | "guess" | "answer" | "outro";

// Stage stuff
export interface CurrentLocation {
  location: string;
  coordinates: Coordinates;
}

export interface CompletedLocation extends CurrentLocation {
  score: number;
}

export type StageList = (CurrentLocation | CompletedLocation)[];

export type ActionType =
  | { type: "next" }
  | { type: "reroll" }
  | { type: "guess"; payload: number }
  | { type: "restart" };
