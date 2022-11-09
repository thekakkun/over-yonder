import { Dispatch, useState } from "react";
import { ActionType, CurrentLocation } from "../types/game";

interface TargetProps {
  target: CurrentLocation;
  dispatch: Dispatch<ActionType>;
}

export default function Target({ target, dispatch }: TargetProps) {
  const [rolls, setRolls] = useState<number>(3);

  return (
    <div className="grid grid-rows-1 grid-cols-[1fr_max-content]">
      <p className="">Point towards:</p>
      <p className="">{target.location}</p>
      <button
        className="bg-slate-400 row-start-1 col-start-2 row-span-2"
        onClick={() => {
          if (0 < rolls) {
            setRolls(rolls - 1);
            dispatch({ type: "reroll" });
          }
        }}
      >
        {`Re-roll (${rolls})`}
      </button>
    </div>
  );
}
