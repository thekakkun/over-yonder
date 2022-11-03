import { Dispatch } from "react";
import { ActionType, Modes, StageList } from "../types/game";
import Game from "./Game";
import Intro from "./Intro";
import Outro from "./Outro";

export interface ContentProps {
  gameLength: number;
  location: GeolocationCoordinates;
  mode: Modes;
  stages: StageList;
  dispatch: Dispatch<ActionType>;
}

export default function Content(props: ContentProps) {
  switch (props.mode) {
    case "intro":
      return <Intro></Intro>;

    case "guess":
    case "answer":
      return <Game {...props}></Game>;

    case "outro":
      return <Outro></Outro>;

    default:
      const _exhaustiveCheck: never = props.mode;
      return _exhaustiveCheck;
  }
}
