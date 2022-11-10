import { Degrees } from "../types/math";
import compass from "../assets/images/compass.png";

interface CompassProps {
  heading: Degrees;
}

export default function Compass({ heading }: CompassProps) {
  return (
    <>
      {heading ? (
        <div className="self-end overflow-clip m-auto">
          <img
            className="rounded-full w-4/5 m-auto"
            style={{
              transformStyle: "preserve-3d",
              transform: `rotateX(45deg) rotate(-${heading}deg)`,
            }}
            src={compass}
            alt={`compass heading: ${heading} degrees`}
          />
        </div>
      ) : (
        <p>Location needs to be enabled</p>
      )}
    </>
  );
}
