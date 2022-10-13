import React from "react";
import { theme, Theme } from "theme/theme";

type ThemeContext = Theme;

export const initialTheme: ThemeContext = theme.light;

export const ThemeContext = React.createContext(initialTheme);
