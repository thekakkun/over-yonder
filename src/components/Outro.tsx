import { CompletedLocation, StageList } from "../types/game";

interface OutroProps {
  stages: StageList;
}

export default function Outro({ stages }: OutroProps) {
  if (stages.some((stage) => !("score" in stage))) {
    throw new Error("Game not completed.");
  }

  return (
    <div>
      <h1>Done!</h1>
      <ol>
        {stages.map((stage) => {
          if (!("score" in stage)) {
            throw new Error("Stage not completed");
          }
          return (
            <li key={stage.location}>{`${stage.location}: ${stage.score}`}</li>
          );
        })}
      </ol>
      <p>{`Total: ${stages.reduce(
        (prev, curr) => prev + (curr as CompletedLocation).score,
        0
      )}/1000`}</p>
    </div>
  );
}
