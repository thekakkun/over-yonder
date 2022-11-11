import { Coordinates } from "../types/cartography";
import { CompletedLocation } from "../types/game";

interface ScoreProps {
  target: CompletedLocation;
  location: Coordinates;
}

export default function Score({ target }: ScoreProps) {
  return (
    <div>
      <p>Your target:</p>
      <p>{`${target.location.city}, ${target.location.country}`}</p>

      <p>You scored:</p>
      <p>{target.score}</p>
    </div>
  );
}
