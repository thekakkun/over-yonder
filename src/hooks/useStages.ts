import { useState } from "react";
import {
  CompletedLocation,
  CurrentLocation,
  Guess,
  StageList,
} from "../types/game";
import { getRandomCity } from "../utilities/game";

export default function useStages(gameLength = 5) {
  const initialStages: StageList = new Array(gameLength).fill(null);
  const [stages, setStages] = useState(initialStages);

  function getCurentStage() {
    let lastStage = stages.reduce(
      (accumulator, currentValue) =>
        (accumulator = currentValue !== null ? currentValue : accumulator)
    );

    if (lastStage === null) {
      throw new Error("Game not started.");
    } else {
      return lastStage;
    }
  }

  function setNextStage() {
    const nextStage = getRandomCity(stages);

    for (const [i, stage] of stages.entries()) {
      if (stage == null) {
        setStages([...stages.slice(0, i), nextStage, ...stages.slice(i + 1)]);
        return nextStage;
      }
    }

    throw new Error("Max number of stages reached.");
  }

  function rerollStage() {
    const newStage = getRandomCity(stages);

    for (const [i, stage] of stages.entries()) {
      if (stage !== null && !("score" in stage)) {
        setStages([...stages.slice(0, i), newStage, ...stages.slice(i + 1)]);
        return newStage;
      }
    }

    throw new Error("No stages in progress.");
  }

  function makeGuess(guess: Guess) {
    const completedStage: CompletedLocation = { ...getCurentStage(), ...guess };

    for (const [i, stage] of stages.entries()) {
      if (stage !== null && !("score" in stage)) {
        setStages([
          ...stages.slice(0, i),
          completedStage,
          ...stages.slice(i + 1),
        ]);
        return;
      }
    }
  }

  function isStarted() {
    return stages[0] !== null;
  }

  function isCompleted() {
    return stages.every((stage) => stage !== null && "score" in stage);
  }

  function restart() {
    setStages(initialStages);
  }

  return {
    stages,
    getCurentStage,
    setNextStage,
    rerollStage,
    makeGuess,
    isStarted,
    isCompleted,
    restart,
  };
}
