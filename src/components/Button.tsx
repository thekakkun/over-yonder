import { Dispatch } from "react";
import { Coordinates } from "../types/cartography";
import { ActionType, Modes, StageList } from "../types/game";
import { Degrees } from "../types/math";
import { getScore } from "../utilities/game";

interface ButtonProps {
  gameLength: number;
  location: Coordinates;
  heading: Degrees;
  mode: Modes;
  setMode: Dispatch<Modes>;
  stages: StageList;
  dispatch: Dispatch<ActionType>;
}

export default function Button(props: ButtonProps) {
  return (
    <button
      className="rounded-full bg-slate-500 text-slate-50 w-3/4 p-4"
      onClick={() => handleClick(props)}
    >
      {buttonText(props)}
    </button>
  );
}

function handleClick({
  gameLength,
  location,
  heading,
  mode,
  setMode,
  stages,
  dispatch,
}: ButtonProps) {
  switch (mode) {
    case "intro":
      setMode("guess");
      dispatch({ type: "next" });
      break;

    case "guess":
      setMode("answer");
      dispatch({
        type: "guess",
        payload: {
          heading: heading,
          score: getScore(location, heading, stages[stages.length - 1]),
        },
      });
      break;

    case "answer":
      if (stages.length === gameLength) {
        setMode("outro");
      } else {
        setMode("guess");
        dispatch({ type: "next" });
      }
      break;

    case "outro":
      setMode("intro");
      dispatch({ type: "restart" });
      break;

    default:
      const _exhaustiveCheck: never = mode;
      return _exhaustiveCheck;
  }
}

function buttonText({ gameLength, mode, stages }: ButtonProps) {
  switch (mode) {
    case "intro":
      return "Start game";

    case "guess":
      return "Make guess";

    case "answer":
      if (stages.length === gameLength) {
        return "Final results";
      } else {
        return "Next location";
      }

    case "outro":
      return "New game";

    default:
      const _exhaustiveCheck: never = mode;
      return _exhaustiveCheck;
  }
}
