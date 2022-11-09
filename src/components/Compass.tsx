import { Degrees } from "../types/math";

interface CompassProps {
  bearing: number;
}

export default function Compass({ bearing }: CompassProps) {
  return (
    <>
      {bearing ? (
        <div className="self-end overflow-clip m-auto">
          <img
            className="rounded-full w-4/5 m-auto transition-transform"
            style={{
              transformStyle: "preserve-3d",
              transform: `rotateX(45deg) rotate(-${bearing}deg)`,
            }}
            src="./compass.png"
            alt={`compass heading: ${bearing}`}
          />
        </div>
      ) : (
        <p>Location needs to be enabled</p>
      )}
    </>
  );
}
