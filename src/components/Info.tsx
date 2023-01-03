import { useState } from "react";
import useStages from "../hooks/useStages";

export default function Info({
  getCurentStage,
  rerollStage,
}: ReturnType<typeof useStages>) {
  const [rolls, setRolls] = useState<number>(3);
  let target = getCurentStage();

  return "score" in target ? (
    <div>
      <p>Your target:</p>
      <p>{`${target.city}, ${target.country}`}</p>

      <p>You scored:</p>
      <p>{target.score}</p>
    </div>
  ) : (
    <div className="grid grid-rows-1 grid-cols-[1fr_max-content]">
      <p className="">Which way is:</p>
      <p className="">{`${target.city}, ${target.country}`}</p>
      <button
        className="bg-slate-400 row-start-1 col-start-2 row-span-2"
        onClick={() => {
          if (rolls) {
            setRolls(rolls - 1);
            rerollStage();
          }
        }}
      >
        {`Re-roll (${rolls})`}
      </button>
    </div>
  );
}
