import { createContext } from "react";

export interface IThemeContextState {
  theme: "light" | "dark";
}

export interface IThemeContext {
  dispatch: (data: Partial<IThemeContextState>) => void;
  state: IThemeContextState;
}

export const ThemeContext = createContext<IThemeContext>({
  dispatch: () => null,
  state: {
    theme: "light",
  },
});
