import React from "react";
import "./App.css";
import LoadingComponent from "./components/LoadingComponent";
// import Portfolio from "./components/Porfolio";
const PortfolioComponent = React.lazy(() => import("./components/Porfolio"));

function App() {
  return (
    <>
      <React.Suspense fallback={<LoadingComponent />}>
        <PortfolioComponent />
      </React.Suspense>
    </>
  );
}

export default App;
