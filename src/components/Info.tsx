import { Dispatch, useState } from "react";
import { ActionType, StageList, Modes, CompletedLocation } from "../types/game";

interface InfoProps {
  mode: Modes;
  dispatch: Dispatch<ActionType>;
  stages: StageList;
}

export default function Info({ mode, dispatch, stages }: InfoProps) {
  let target = stages[stages.length - 1];

  const [rolls, setRolls] = useState<number>(3);
  let targetInfo = (
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

  let scoreInfo = (
    <div>
      <p>Your target:</p>
      <p>{`${target.city}, ${target.country}`}</p>

      <p>You scored:</p>
      <p>{(target as CompletedLocation).score}</p>
    </div>
  );

  return mode === "guess" ? targetInfo : scoreInfo;
}
