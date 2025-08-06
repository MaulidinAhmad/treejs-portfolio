import React from "react";
import "./styles/index.scss";
import LoadingComponent from "./components/LoadingComponent";
import ThemeContextProvider from "./context/ContextProvider";
// import Portfolio from "./components/Porfolio";
const PortfolioComponent = React.lazy(() => import("./components/Porfolio"));

function App() {
  return (
    <ThemeContextProvider>
      <React.Suspense fallback={<LoadingComponent />}>
        <PortfolioComponent />
      </React.Suspense>
    </ThemeContextProvider>
  );
}

export default App;
