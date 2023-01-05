import { useState } from "react";

import {
  CompletedLocation,
  CurrentLocation,
  Guess,
  StageList,
} from "../types/game";
import { getRandomCity } from "../utilities/game";

export default function useStages(length = 5) {
  const [stages, setStages] = useState<StageList | null>(null);

  function init() {
    const initialStages: StageList = new Array(length).fill(null);
    setStages(initialStages);
  }

  function current(): CurrentLocation | CompletedLocation {
    if (stages === null) {
      throw new Error("stage list not initialized.");
    }

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

  function setNext(): CurrentLocation {
    if (stages === null) {
      throw new Error("stage list not initialized.");
    }

    const nextStage = getRandomCity(stages);

    for (const [i, stage] of stages.entries()) {
      if (stage == null) {
        setStages([...stages.slice(0, i), nextStage, ...stages.slice(i + 1)]);
        return nextStage;
      }
    }

    throw new Error("Max number of stages reached.");
  }

  function reroll() {
    if (stages === null) {
      throw new Error("stage list not initialized.");
    }

    const newStage = getRandomCity(stages);

    for (const [i, stage] of stages.entries()) {
      if (stage !== null && !("score" in stage)) {
        setStages([...stages.slice(0, i), newStage, ...stages.slice(i + 1)]);
        return;
      }
    }

    throw new Error("No stages in progress.");
  }

  function makeGuess(guess: Guess): void {
    if (stages === null) {
      throw new Error("stage list not initialized.");
    }

    const completedStage: CompletedLocation = { ...current(), ...guess };

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

  function onFinal(): boolean {
    if (stages === null) {
      throw new Error("stage list not initialized.");
    }

    return stages[length - 1] !== null;
  }

  return {
    list: stages,
    init,
    current,
    setNext,
    reroll,
    makeGuess,
    onFinal,
  };
}
