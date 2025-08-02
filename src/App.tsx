import { lazy, Suspense } from "react";
import LoadingComponent from "./components/LoadingComponent";
import "./App.css";

const PorfolioComponent = lazy(() => import("./components/Porfolio"));

function App() {
  return (
    <>
      <Suspense fallback={<LoadingComponent />}>
        <PorfolioComponent />
      </Suspense>
    </>
  );
}

export default App;
