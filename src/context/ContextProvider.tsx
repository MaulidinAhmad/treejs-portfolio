import { useState } from "react";
import { ThemeContext, type IThemeContextState } from "./ThemeContext";

const ThemeContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<IThemeContextState>({
    theme: "light",
  });

  return (
    <ThemeContext.Provider
      value={{
        dispatch: (data: IThemeContextState) => setTheme(data),
        state: theme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContextProvider;
