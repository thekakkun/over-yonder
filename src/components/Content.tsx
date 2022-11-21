import { ReactElement } from "react";

export interface ContentProps {
  children: ReactElement;
}

export default function Content(props: ContentProps) {
  return <div className="grow p-4 w-full"> {props.children}</div>;
}
