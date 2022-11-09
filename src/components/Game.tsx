import { Dispatch } from "react";
import { Coordinates } from "../types/cartography";
import { Modes, StageList, ActionType, CompletedLocation } from "../types/game";
import Compass from "./Compass";
import Display from "./Display";
import Map from "./Map";
import Progress from "./Progress";
import Score from "./Score";
import Target from "./Target";

interface GameProps {
  gameLength: number;
  location: Coordinates;
  mode: Modes;
  stages: StageList;
  dispatch: Dispatch<ActionType>;
}

export default function Game({
  gameLength,
  location,
  mode,
  stages,
  dispatch,
}: GameProps) {
  const guessDisplay = (
    <>
      <Target target={stages[stages.length - 1]} dispatch={dispatch}></Target>
      <Compass location={location}></Compass>
    </>
  );

  const answerDisplay = (
    <>
      <Score
        target={stages[stages.length - 1] as CompletedLocation}
        location={location}
      ></Score>
      <Map
        target={stages[stages.length - 1] as CompletedLocation}
        location={location}
      ></Map>
    </>
  );

  return (
    <div className="h-full flex flex-col gap-3">
      <Progress gameLength={gameLength} stages={stages}></Progress>
      <Display>{mode === "guess" ? guessDisplay : answerDisplay}</Display>
    </div>
  );
}
