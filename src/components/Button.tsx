import useStages from "../hooks/useStages";
import { Position } from "../types/game";
import { getScore } from "../utilities/game";

interface ButtonProps {
  position: Position;
  stageState: ReturnType<typeof useStages>;
}

export default function Button(props: ButtonProps) {
  return (
    <button
      className="rounded-full bg-slate-500 text-slate-50 w-3/4 p-4"
      onClick={() => handleClick(props)}
    >
      {buttonText(props.stageState)}
    </button>
  );
}

function handleClick({ position, stageState }: ButtonProps) {
  if (!stageState.isStarted()) {
    // game hasn't started yet
    stageState.setNextStage();
  } else if (stageState.isCompleted()) {
    // game is done
    stageState.restart();
  } else if (!("score" in stageState.getCurentStage())) {
    // current stage has no score
    if (position.heading === null) {
      throw new Error("Heading not available.");
    }

    let score = getScore(position, stageState.getCurentStage());
    stageState.makeGuess({ heading: position.heading, score: score });
  } else {
    // current stage has score
    if (!stageState.isCompleted()) {
      stageState.setNextStage();
    }
  }
}

function buttonText({
  isStarted,
  isCompleted,
  getCurentStage,
}: ReturnType<typeof useStages>) {
  if (!isStarted()) {
    // game hasn't started yet
    return "Start Game";
  } else if (isCompleted()) {
    // game is done
    return "New game";
  } else if (!("score" in getCurentStage())) {
    // current stage has no score
    return "Make guess";
  } else {
    // current stage has score
    if (isCompleted()) {
      // all stages have score
      return "Final results";
    } else {
      // still more stages to go
      return "Next location";
    }
  }
}
