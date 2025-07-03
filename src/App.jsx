import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

import AppRoutes from './AppRoutes';

import { SunMoon,Sun, Moon, Globe } from 'lucide-react';





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
    console.log(themeMode)
    setThemeMode(prev => {
      const newMode =
        prev === 'light' ? 'dark' :
        prev === 'dark' ? 'auto' :
        'light';

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

  const filteredLanguages = languageOptions.filter(l =>
    l.label.toLowerCase().includes(langSearch.toLowerCase())
  );


  

  

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[var(--bg-color)] text-[var(--text-color)] transition-colors">
        <nav className={`sticky top-0 z-50 flex justify-between items-center px-4 py-3 border-b transition-shadow bg-[var(--bg-color)] ${scrolled ? 'shadow-md' : ''}`}>
          <div className="flex gap-4">
            <Link to="/" className="underline">{t('home')}</Link>
            <Link to="/about" className="underline">{t('about')}</Link>
          </div>

          <div className="relative flex items-center gap-2">
            {/* Language Dropdown */}
            <div className="relative">
              <button
                onClick={() => setLangDropdownOpen(prev => !prev)}
                className="p-2 border rounded hover:bg-gray-200 flex items-center gap-2"
              >
                <Globe className="w-5 h-5" />
                {language.toUpperCase()}
              </button>
              <div
                  className={`absolute right-0 top-full mt-2 w-48 bg-white text-black border rounded shadow-md z-10 p-2 transition-all duration-200 transform ${
                    langDropdownOpen ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
                  }`}
                >
                  {ENABLE_LANG_SEARCH && (
                    <input
                      type="text"
                      placeholder="Search language..."
                      value={langSearch}
                      onChange={e => setLangSearch(e.target.value)}
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
          </div>
        </nav>

        <main className="p-6">
          <AppRoutes />
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;