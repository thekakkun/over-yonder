import { useState } from "react";

import { Position } from "../types/game";
import { getScore } from "../utilities/game";
import useStages from "./useStages";

export enum GameState {
  Intro,
  Guess,
  Answer,
  LastAnswer,
  Outro,
}

export default function useGame(
  stages: ReturnType<typeof useStages>,
  position: Position
) {
  const [gameState, setGameState] = useState(GameState.Intro);

  function advance() {
    switch (gameState) {
      case GameState.Intro:
        stages.setNext();
        setGameState(GameState.Guess);
        break;

      case GameState.Guess:
        if (position.heading === null) {
          throw new Error("Heading is null.");
        }

        const score = getScore(stages.current(), position);
        stages.makeGuess({ heading: position.heading, score });

        if (stages.onFinal()) {
          setGameState(GameState.LastAnswer);
        } else {
          setGameState(GameState.Answer);
        }
        break;

      case GameState.Answer:
        stages.setNext();
        setGameState(GameState.Guess);

        break;

      case GameState.LastAnswer:
        setGameState(GameState.Outro);
        break;

      case GameState.Outro:
        stages.reset();
        setGameState(GameState.Intro);
        break;

      default:
        break;
    }
  }

  return {
    state: gameState,
    advance,
  };
}
