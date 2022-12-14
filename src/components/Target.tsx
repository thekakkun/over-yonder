import { Dispatch, useState } from "react";
import { ActionType, CurrentLocation, StageList } from "../types/game";

interface TargetProps {
  target: CurrentLocation;
  dispatch: Dispatch<ActionType>;
  stages: StageList;
}

export default function Target({ target, dispatch, stages }: TargetProps) {
  const [rolls, setRolls] = useState<number>(3);

  return (
    <div className="grid grid-rows-1 grid-cols-[1fr_max-content]">
      <p className="">Which way is:</p>
      <p className="">{`${target.city}, ${target.country}`}</p>
      <button
        className="bg-slate-400 row-start-1 col-start-2 row-span-2"
        onClick={() => {
          if (0 < rolls) {
            setRolls(rolls - 1);
            dispatch({ type: "reroll", payload: stages });
          }
        }}
      >
        {`Re-roll (${rolls})`}
      </button>
    </div>
  );
}
