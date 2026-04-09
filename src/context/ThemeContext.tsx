import React, {createContext, useContext, useEffect} from 'react';
import {getTheme, type Theme} from '../theme';
import useSettingsStore from '../stores/useSettingStore';

interface ThemeContextType {
  theme: Theme;
  isDarkMode: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: getTheme(false),
  isDarkMode: false,
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const { isDarkMode, loadSettings } = useSettingsStore();

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const theme = getTheme(isDarkMode);

  return (
    <ThemeContext.Provider value={{theme, isDarkMode}}>
      {children}
    </ThemeContext.Provider>
  );
};
