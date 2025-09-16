import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BrowserRouter } from 'react-router-dom';

import AppRoutes from './AppRoutes';

import { ThemeContext } from './components/ThemeContext';

import SplashCursor from './components/SplashCursor.jsx';

import Navbar from './components/Navbar/Navbar.jsx';

const languageOptions = [
  { code: 'en', label: '🇺🇸 English' },
  { code: 'it', label: '🇮🇹 Italiano' },
  { code: 'es', label: '🇪🇸 Español' }, // add more as needed
];

const ENABLE_LANG_SEARCH = true;

function App() {
  // SCROLL NAVBAR
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // 🌗 Theme handling
  const getStoredTheme = () => localStorage.getItem('theme-mode') || 'auto';

  const [themeMode, setThemeMode] = useState(getStoredTheme); // 'light' | 'dark' | 'auto'

  const getEffectiveTheme = () => {
    if (themeMode === 'light' || themeMode === 'dark') return themeMode;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  const [theme, setTheme] = useState(getEffectiveTheme);

  useEffect(() => {
    const updateTheme = () => {
      const newTheme = getEffectiveTheme();
      setTheme(newTheme);
      document.documentElement.setAttribute('data-theme', newTheme);
    };

    updateTheme();

    if (themeMode === 'auto') {
      const media = window.matchMedia('(prefers-color-scheme: dark)');
      media.addEventListener('change', updateTheme);
      return () => media.removeEventListener('change', updateTheme);
    }
  }, [themeMode]);

  const toggleTheme = () => {
    // console.log(themeMode);
    setThemeMode((prev) => {
      const newMode = prev === 'light' ? 'dark' : prev === 'dark' ? 'auto' : 'light';

      localStorage.setItem('theme-mode', newMode);
      return newMode;
    });
  };

  // LANGUAGE
  const { t, i18n } = useTranslation();
  const getInitialLang = () => localStorage.getItem('lang') || 'en';
  const [language, setLanguage] = useState(getInitialLang());

  useEffect(() => {
    i18n.changeLanguage(language);
    localStorage.setItem('lang', language);
  }, [language]);

  const getStoredCursorPreference = () => {
    if (typeof window === 'undefined') return null;
    const stored = localStorage.getItem('splash-cursor-enabled');
    if (stored === null) return null;
    return stored === 'true';
  };

  const [cursorEnabled, setCursorEnabled] = useState(() => {
    const stored = getStoredCursorPreference();
    return stored !== null ? stored : true;
  });

  const [cursorSupported, setCursorSupported] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const canvas = document.createElement('canvas');
    const gl =
      canvas.getContext('webgl2') ||
      canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl');
    if (!gl) {
      setCursorSupported(false);
      setCursorEnabled(false);
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('splash-cursor-enabled', cursorEnabled ? 'true' : 'false');
  }, [cursorEnabled]);

  const toggleCursor = () => {
    setCursorEnabled((prev) => !prev);
  };

  return (
    <ThemeContext.Provider value={{ themeMode, theme, setThemeMode }}>
      <BrowserRouter>
        <div className="flex flex-col h-screen bg-[var(--bg-color)] text-[var(--text-color)] transition-colors">
          <Navbar
            links={[
              { to: '/', label: t('home') },
              { to: '/about', label: t('about') },
              { to: '/experience', label: t('experience') },
            ]}
            scrolled={scrolled}
            language={language}
            languageOptions={languageOptions}
            onLanguageChange={setLanguage}
            enableLangSearch={ENABLE_LANG_SEARCH}
            themeMode={themeMode}
            theme={theme}
            onToggleTheme={toggleTheme}
            cursorEnabled={cursorEnabled}
            cursorSupported={cursorSupported}
            onToggleCursor={toggleCursor}
          />

          <main className="flex-1 h-full min-h-0 overflow-hidden">
            <AppRoutes />
          </main>
        </div>
      </BrowserRouter>
      {cursorEnabled && <SplashCursor />}
    </ThemeContext.Provider>
  );
}

export default App;
