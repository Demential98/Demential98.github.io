import { createContext, useContext } from 'react';

export const ThemeContext = createContext({
  themeMode: 'auto',
  theme: 'light',
  setThemeMode: () => {},
});

export const useTheme = () => useContext(ThemeContext);
