import { useState } from "react";
import { CompletedLocation, CurrentLocation } from "../types/game";
import Progress from "./Progress";
import Target from "./Target";

export default function Game() {
  const gameLength = 5;
  const [current, setCurrent] = useState<CurrentLocation>(getLocation());
  const initCompleted = [
    {
      location: "Tokyo",
      coordinates: { lat: 35.6839, lon: 139.7744 },
      score: 50,
    },
    {
      location: "Jakarta sadf",
      coordinates: { lat: -6.2146, lon: 106.8451 },
      score: 100,
    },
  ];
  const [completed, setCompleted] =
    useState<CompletedLocation[]>(initCompleted);

  return (
    <>
      <Progress
        gameLength={gameLength}
        current={current}
        completed={completed}
      ></Progress>
      <Target {...current}></Target>
    </>
  );
}

function getLocation(): CurrentLocation {
  return { location: "New York", coordinates: { lat: 40.6943, lon: -73.9249 } };
}
