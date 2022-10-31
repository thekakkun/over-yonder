import { CompletedLocation, CurrentLocation } from "../types/game";

interface UnplayedStageProps {
  stage: number;
}

interface CompletedStageProps extends CompletedLocation, UnplayedStageProps {
  score: number;
}

interface CurrentStageProps extends CurrentLocation, UnplayedStageProps {}

export default function Stage(
  props: CompletedStageProps | CurrentStageProps | UnplayedStageProps
) {
  return (
    <li className="flex-1 bg-slate-400">
      <p className="text-center">{props.stage + 1}</p>
      {"location" in props ? (
        <p className="text-center">{props.location}</p>
      ) : null}
      {"score" in props ? <p className="text-center">{props.score}</p> : null}
    </li>
  );
}
