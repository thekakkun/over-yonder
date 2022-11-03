interface StageProps {
  stageNum: number;
  location?: string;
  score?: number;
}

export default function Stage({ stageNum, location, score }: StageProps) {
  return (
    <li className="flex-1 bg-slate-400">
      <p className="text-center">{stageNum + 1}</p>
      {"location" ? <p className="text-center">{location}</p> : null}
      {"score" ? <p className="text-center">{score}</p> : null}
    </li>
  );
}
