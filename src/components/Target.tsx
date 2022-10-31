import { CurrentLocation } from "../types/game";

export default function Target(props: CurrentLocation) {
  return (
    <div className="grid grid-rows-1 grid-cols-[1fr_max-content] m-4">
      <p className="">Point towards:</p>
      <p className="">{props.location}</p>
      <button className="bg-slate-400 row-start-1 col-start-2 row-span-2">Re-roll</button>
    </div>
  );
}
