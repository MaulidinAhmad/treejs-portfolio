import { useProgress } from "@react-three/drei";
import Button from "./Button";
import { memo, useDeferredValue } from "react";

const LoadingComponent = memo(
  ({ handleLoad, isLoaded }: { isLoaded: boolean; handleLoad: () => void }) => {
    const { loaded } = useProgress();
    const isLoadedDeffered = useDeferredValue(loaded);

    return (
      <div
        className={
          "loading-container" + (isLoaded ? " loading-container--loaded" : "")
        }
      >
        {!isLoadedDeffered ? (
          <p>Loading...</p>
        ) : (
          <Button
            disabled={!loaded}
            className="enter-button"
            onClick={handleLoad}
          >
            ENTER
          </Button>
        )}

        {/* <p className="desktop-instructions instructions">
        use left/right click and mouse wheel to navigate!
      </p>
      <p className="mobile-instructions instructions">
        use one or two fingers to navigate!
      </p> */}
      </div>
    );
  }
);

export default LoadingComponent;
