import { CompletedLocation, CurrentLocation } from "../types/game";
import Stage from "./Stage";

interface ProgressProps {
  gameLength: number;
  current: CurrentLocation;
  completed: CompletedLocation[];
}

export default function Progress({
  gameLength,
  current,
  completed,
}: ProgressProps) {
  const stages = [];
  for (let i = 0; i < gameLength; i++) {
    if (i < completed.length) {
      stages.push(<Stage key={i} {...completed[i]} stage={i}></Stage>);
    } else if (i === completed.length) {
      stages.push(<Stage key={i} {...current} stage={i}></Stage>);
    } else {
      stages.push(<Stage key={i} stage={i}></Stage>);
    }
  }

  return <ol className="flex flex-row gap-1 m-4">{stages}</ol>;
}
