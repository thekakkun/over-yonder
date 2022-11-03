import { Degrees } from "../types/math";

interface CompassProps {
  heading: Degrees | null;
}

export default function Compass({ heading }: CompassProps) {
  return (
    <>
      {heading ? (
        <div className="self-end overflow-clip">
          <img
            className="rounded-full w-4/5 m-auto transition-transform"
            style={{
              transformStyle: "preserve-3d",
              transform: `rotateX(45deg) rotate(-${heading}deg)`,
            }}
            src="./compass.png"
            alt={`compass heading: ${heading}`}
          />
        </div>
      ) : (
        <p>Location needs to be enabled</p>
      )}
    </>
  );
}
