import { ReactElement } from "react";

interface DisplayProps {
  children: ReactElement;
}

export default function Display(props: DisplayProps) {
  return <div>{props.children}</div>;
}
