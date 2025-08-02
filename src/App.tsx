import { lazy, Suspense } from "react";
import LoadingComponent from "./LoadingComponent";

const PorfolioComponent = lazy(() => import("./Porfolio"));

function App() {
  return (
    <div id="canvas-container">
      <Suspense fallback={<LoadingComponent />}>
        <PorfolioComponent />
      </Suspense>
    </div>
  );
}

export default App;
