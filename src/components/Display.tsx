import { ReactElement } from "react";

interface DisplayProps {
  children: ReactElement;
}

export default function Display(props: DisplayProps) {
  return (
    <div className="h-full flex flex-col justify-between">
      {props.children}
    </div>
  );
}
