import { SVGProps } from "react";

interface MapElementProps {
  svg: SVGProps<SVGPathElement>[] | SVGProps<SVGPathElement>;
}

export default function MapElement({ svg }: MapElementProps) {
  if (Array.isArray(svg)) {
    return (
      <g>
        {svg.map((path, i) => (
          <path {...path} key={i}></path>
        ))}
      </g>
    );
  } else {
    return <path {...svg}></path>;
  }
}
