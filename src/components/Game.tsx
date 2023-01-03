import useStages from "../hooks/useStages";

import { Position } from "../types/game";
import Compass from "./Compass";
import Display from "./Display";
import Info from "./Info";
import Map from "./Map";
import Progress from "./Progress";

interface GameProps {
  position: Position;
  stageState: ReturnType<typeof useStages>;
}

export default function Game({ position, stageState }: GameProps) {
  if (position.heading === null) {
    throw new Error("Heading not available.");
  }
  if (position.coordinates === null) {
    throw new Error("Coordinates not available.");
  }

  let currentStage = stageState.getCurentStage();

  return (
    <div className="h-full flex flex-col gap-3">
      <Progress {...stageState}></Progress>
      <Info {...stageState}></Info>
      <Display>
        {"score" in currentStage ? (
          <Map target={currentStage} location={position.coordinates}></Map>
        ) : (
          <Compass heading={position.heading}></Compass>
        )}
      </Display>
    </div>
  );
}
