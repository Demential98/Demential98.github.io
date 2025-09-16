import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

import AppRoutes from './AppRoutes';

import { SunMoon, Sun, Moon, Globe, Star } from 'lucide-react';

import { ThemeContext } from './components/ThemeContext';

import SplashCursor from './components/SplashCursor.jsx';

import StarBorder from './components/StarBorder/StarBorder.jsx';
import ShinyText from './components/ShinyText/ShinyText.jsx';

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
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [langSearch, setLangSearch] = useState('');

  useEffect(() => {
    i18n.changeLanguage(language);
    localStorage.setItem('lang', language);
  }, [language]);

  const filteredLanguages = languageOptions.filter((l) =>
    l.label.toLowerCase().includes(langSearch.toLowerCase())
  );

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
          {/* NAVBAR */}
          <nav
            className={`sticky top-0 z-50 flex justify-between items-center px-4 py-3 border-b transition-shadow bg-[var(--bg-color)] ${
              scrolled ? 'shadow-md' : ''
            }`}
          >
            <div className="flex gap-4 justify-center">
              <StarBorder
                as="div"
                className="custom-class"
                color={theme === 'dark' ? 'cyan' : '#020617'}
                thickness="2"
                speed="5s"
              >
                <Link to="/">
                  <ShinyText text={t('home')} disabled={false} speed={3} className="custom-class" />
                </Link>
              </StarBorder>
              <StarBorder
                as="div"
                className="custom-class"
                color={theme === 'dark' ? 'cyan' : '#020617'}
                thickness="2"
                speed="5s"
              >
                <Link to="/about">
                  <ShinyText
                    text={t('about')}
                    disabled={false}
                    speed={3}
                    className="custom-class"
                  />
                </Link>
              </StarBorder>
              <StarBorder
                as="div"
                className="custom-class"
                color={theme === 'dark' ? 'cyan' : '#020617'}
                thickness="2"
                speed="5s"
              >
                <Link to="/experience">
                  <ShinyText
                    text={t('experience')}
                    disabled={false}
                    speed={3}
                    className="custom-class"
                  />
                </Link>
              </StarBorder>
            </div>

            <div className="relative flex items-center gap-2">
              {/* Language Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setLangDropdownOpen((prev) => !prev)}
                  className="p-2 border rounded hover:bg-gray-200 flex items-center gap-2"
                >
                  <Globe className="w-5 h-5" />
                  {language.toUpperCase()}
                </button>
                <div
                  className={`absolute right-0 top-full mt-2 w-48 bg-white text-black border rounded shadow-md z-10 p-2 transition-all duration-200 transform ${
                    langDropdownOpen
                      ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
                      : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
                  }`}
                >
                  {ENABLE_LANG_SEARCH && (
                    <input
                      type="text"
                      placeholder="Search language..."
                      value={langSearch}
                      onChange={(e) => setLangSearch(e.target.value)}
                      className="mb-2 w-full p-1 border rounded"
                    />
                  )}
                  {filteredLanguages.map(({ code, label }) => (
                    <button
                      key={code}
                      onClick={() => {
                        setLanguage(code);
                        setLangDropdownOpen(false);
                        setLangSearch('');
                      }}
                      className="block w-full text-left px-2 py-1 hover:bg-gray-200 rounded"
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Theme toggle button */}
              <button
                onClick={toggleTheme}
                className="p-2 border rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-150"
              >
                {themeMode === 'light' && <Sun className="w-5 h-5 text-yellow-600" />}
                {themeMode === 'dark' && <Moon className="w-5 h-5 text-white" />}
                {themeMode === 'auto' && (
                  <SunMoon
                    className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-300' : 'text-yellow-400'}`}
                  />
                )}
              </button>

              <button
                type="button"
                onClick={toggleCursor}
                disabled={!cursorSupported}
                className={`p-2 border rounded transition-colors duration-150 ${
                  cursorSupported
                    ? 'hover:bg-gray-200 dark:hover:bg-gray-700'
                    : 'opacity-60 cursor-not-allowed'
                }`}
                title={
                  cursorSupported
                    ? cursorEnabled
                      ? 'Disable interactive cursor'
                      : 'Enable interactive cursor'
                    : 'Interactive cursor not supported on this device'
                }
                aria-pressed={cursorEnabled}
              >
                <Star
                  className={`w-5 h-5 ${
                    cursorSupported && cursorEnabled
                      ? 'rainbow-star'
                      : 'text-gray-400 dark:text-gray-600'
                  }`}
                />
              </button>
            </div>
          </nav>

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
