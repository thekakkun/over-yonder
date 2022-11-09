import { StageList } from "../types/game";
import Stage from "./Stage";

interface ProgressProps {
  gameLength: number;
  stages: StageList;
}

export default function Progress({ gameLength, stages }: ProgressProps) {
  return (
    <ol className="flex flex-row gap-1">
      {Array.from({ ...stages, length: gameLength }).map((stage, i) => (
        <Stage key={i} {...stage} stageNum={i}></Stage>
      ))}
    </ol>
  );
}
