import { CompletedLocation } from "../types/game";

interface ScoreProps {
  target: CompletedLocation;
  location: GeolocationCoordinates;
}

export default function Score({ target }: ScoreProps) {
  return (
    <div>
      <p>Your target:</p>
      <p>{target.location}</p>

      <p>You scored:</p>
      <p>{target.score}</p>
    </div>
  );
}