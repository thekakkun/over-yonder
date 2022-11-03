import { ReactElement } from "react";

export interface ContentProps {
  children: ReactElement;
}

export default function Content(props: ContentProps) {
  return <div> {props.children}</div>;
}
