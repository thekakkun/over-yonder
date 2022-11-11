import { Location } from "../types/cartography";

interface StageProps {
  stageNum: number;
  location?: Location;
  score?: number;
}

export default function Stage({ stageNum, location, score }: StageProps) {
  return (
    <li className="flex-1 bg-slate-400">
      <p className="text-center">{stageNum + 1}</p>
      {location ? <p className="text-center">{location.city}</p> : null}
      {score !== undefined ? <p className="text-center">{score}</p> : null}
    </li>
  );
}
