import { Dispatch } from "react";

import { Coordinates } from "../types/cartography";
import { ActionType, CompletedLocation, Modes, StageList } from "../types/game";
import { Degrees } from "../types/math";
import Compass from "./Compass";
import Display from "./Display";
import Info from "./Info";
import Map from "./Map";
import Progress from "./Progress";

interface GameProps {
  gameLength: number;
  location: Coordinates;
  heading: Degrees;
  mode: Modes;
  stages: StageList;
  dispatch: Dispatch<ActionType>;
}

export default function Game({
  gameLength,
  location,
  heading,
  mode,
  stages,
  dispatch,
}: GameProps) {
  const guessDisplay = <Compass heading={heading}></Compass>;

  const answerDisplay = (
    <Map
      target={stages[stages.length - 1] as CompletedLocation}
      location={location}
    ></Map>
  );

  return (
    <div className="h-full flex flex-col gap-3">
      <Progress gameLength={gameLength} stages={stages}></Progress>
      <Info mode={mode} dispatch={dispatch} stages={stages}></Info>
      <Display>{mode === "guess" ? guessDisplay : answerDisplay}</Display>
    </div>
  );
}
