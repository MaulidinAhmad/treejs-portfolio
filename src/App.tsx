import "./styles/index.scss";
import ThemeContextProvider from "./context/ContextProvider";
import Portfolio from "./components/Porfolio";

function App() {
  return (
    <ThemeContextProvider>
      <Portfolio />
    </ThemeContextProvider>
  );
}

export default App;
