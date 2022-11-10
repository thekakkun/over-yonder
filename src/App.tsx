import { useEffect, useReducer, useState } from "react";
import Button from "./components/Button";
import Content from "./components/Content";
import Game from "./components/Game";
import Header from "./components/Header";
import Intro from "./components/Intro";
import Outro from "./components/Outro";
import { Coordinates } from "./types/cartography";
import { ActionType, Modes, StageList } from "./types/game";
import { Degrees } from "./types/math";
import { geolocationAvailable } from "./utilities/cartography";
import { getHeading, getLocation } from "./utilities/game";

function App() {
  const gameLength = 5;

  const [mode, setMode] = useState<Modes>("intro");
  const [stages, dispatch] = useReducer(stagesReducer, initialStages);

  const [location, setLocation] = useState<Coordinates | null>(null);
  useEffect(() => {
    if (geolocationAvailable()) {
      navigator.geolocation.watchPosition(
        ({ coords: { latitude, longitude } }) => {
          setLocation({
            latitude: latitude,
            longitude: longitude,
          });
        }
      );
    }
  }, []);

  const [heading, setHeading] = useState<Degrees | null>(null);
  useEffect(() => {
    if ("ondeviceorientationabsolute" in window) {
      window.addEventListener("deviceorientationabsolute", (event) => {
        setHeading(getHeading(event as DeviceOrientationEvent));
      });
      return;
    } else if ("ondeviceorientation" in window) {
      window.addEventListener("deviceorientation", (event) => {
        setHeading(getHeading(event));
      });
    }
  }, []);

  function getContent() {
    if (location === null) {
      return <p>Location services are needed</p>;
    }
    if (heading === null) {
      return <p>Device orientation data is needed</p>;
    }

    switch (mode) {
      case "intro":
        return <Intro></Intro>;

      case "guess":
      case "answer":
        return (
          <Game
            gameLength={gameLength}
            location={location}
            heading={heading}
            mode={mode}
            stages={stages}
            dispatch={dispatch}
          ></Game>
        );

      case "outro":
        return <Outro stages={stages}></Outro>;

      default:
        const _exhaustiveCheck: never = mode;
        return _exhaustiveCheck;
    }
  }

  return (
    <div className="h-screen flex flex-col items-center justify-between gap-1 pb-4">
      <Header></Header>
      <Content>{getContent()}</Content>
      {location && heading && (
        <Button
          gameLength={gameLength}
          location={location}
          heading={heading}
          mode={mode}
          setMode={setMode}
          stages={stages}
          dispatch={dispatch}
        ></Button>
      )}
    </div>
  );
}

const initialStages: StageList = [];
function stagesReducer(state: typeof initialStages, action: ActionType) {
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
      if ("heading" in currentStage || "score" in currentStage) {
        throw Error("Current stage already has a guess");
      }

      return [...state.slice(0, -1), { ...currentStage, ...action.payload }];

    case "restart":
      return initialStages;

    default:
      const _exhaustiveCheck: never = action;
      return _exhaustiveCheck;
  }
}

export default App;
