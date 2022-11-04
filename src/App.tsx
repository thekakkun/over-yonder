import { useReducer, useState } from "react";
import Button from "./components/Button";
import Content from "./components/Content";
import Game from "./components/Game";
import Header from "./components/Header";
import Intro from "./components/Intro";
import Outro from "./components/Outro";
import { Modes, StageList, ActionType } from "./types/game";
import { getLocation } from "./utilities/game";

function App() {
  const gameLength = 5;

  const [location, setLocation] = useState<GeolocationCoordinates>({
    latitude: 43.6532,
    longitude: -79.3733,
    altitude: null,
    accuracy: 0,
    altitudeAccuracy: null,
    heading: 180,
    speed: null,
  });

  const [mode, setMode] = useState<Modes>("intro");
  const [stages, dispatch] = useReducer(reducer, initialStages);

  const gameElement = (
    <Game
      gameLength={gameLength}
      location={location}
      mode={mode}
      stages={stages}
      dispatch={dispatch}
    ></Game>
  );

  return (
    <div className="h-screen flex flex-col items-center justify-between gap-1 pb-4">
      <Header></Header>
      <Content>
        {mode === "intro" ? (
          <Intro></Intro>
        ) : ["guess", "answer"].includes(mode) ? (
          gameElement
        ) : (
          <Outro></Outro>
        )}
      </Content>
      <Button
        gameLength={gameLength}
        location={location}
        mode={mode}
        setMode={setMode}
        stages={stages}
        dispatch={dispatch}
      ></Button>
    </div>
  );
}

const initialStages: StageList = [];

function reducer(state: typeof initialStages, action: ActionType) {
  switch (action.type) {
    case "next":
      return [...state, getLocation()];

    case "reroll":
      return [...state.slice(0, -1), getLocation()];

    case "guess":
      if (state.length === 0) {
        throw Error("No stages");
      }

      const currentStage = state[state.length - 1];
      if ("score" in currentStage) {
        throw Error("Current stage already has a score");
      }

      return [
        ...state.slice(0, -1),
        { ...currentStage, score: action.payload },
      ];

    case "restart":
      return initialStages;

    default:
      const _exhaustiveCheck: never = action;
      return _exhaustiveCheck;
  }
}

export default App;
