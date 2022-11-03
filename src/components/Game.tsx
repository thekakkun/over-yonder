import { Dispatch } from "react";
import { Modes, StageList, ActionType } from "../types/game";
import Compass from "./Compass";
import Display from "./Display";
import Progress from "./Progress";
import Target from "./Target";

interface GameProps {
  gameLength: number;
  location: GeolocationCoordinates;
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
      <Compass heading={location.heading}></Compass>
    </>
  );

  const answerDisplay = <></>;

  return (
    <div className="flex-1 grid grid-rows-[auto_auto_1fr] grid-cols-1 items-center">
      <Progress gameLength={gameLength} stages={stages}></Progress>
      <Display>{mode === "guess" ? guessDisplay : answerDisplay}</Display>
    </div>
  );
}
