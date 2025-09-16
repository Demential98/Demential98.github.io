import { useState } from 'react';
import { Link } from 'react-router-dom';
import { SunMoon, Sun, Moon, Globe, Star } from 'lucide-react';

import StarBorder from '../StarBorder/StarBorder.jsx';
import ShinyText from '../ShinyText/ShinyText.jsx';

function Navbar({
  links = [],
  scrolled = false,
  language = 'en',
  languageOptions = [],
  onLanguageChange = () => {},
  enableLangSearch = true,
  themeMode = 'auto',
  theme = 'light',
  onToggleTheme = () => {},
  cursorEnabled = true,
  cursorSupported = true,
  onToggleCursor = () => {},
}) {
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [langSearch, setLangSearch] = useState('');

  const filteredLanguages = languageOptions.filter(({ label }) =>
    label.toLowerCase().includes(langSearch.toLowerCase())
  );

  return (
    <nav
      className={`sticky top-0 z-50 flex justify-between items-center px-4 py-3 border-b transition-shadow bg-[var(--bg-color)] ${
        scrolled ? 'shadow-md' : ''
      }`}
    >
      <div className="flex gap-4 justify-center">
        {links.map(({ to, label }) => (
          <StarBorder
            key={to}
            as={Link}
            to={to}
            className="custom-class"
            color={theme === 'dark' ? 'cyan' : '#020617'}
            thickness="2"
            speed="5s"
          >
            <ShinyText text={label} disabled={false} speed={3} className="custom-class" />
          </StarBorder>
        ))}
      </div>

      <div className="relative flex items-center gap-2">
        <div className="relative">
          <button
            onClick={() => setLangDropdownOpen((prev) => !prev)}
            className="p-2 border rounded flex items-center gap-2 transition-colors duration-150 hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <Globe className="w-5 h-5" />
            {language.toUpperCase()}
          </button>
          <div
            className={`absolute right-0 top-full mt-2 w-48 bg-[var(--bg-color)] text-[var(--text-color)] border border-slate-200 dark:border-slate-700 rounded shadow-md z-10 p-2 transition-all duration-200 transform ${
              langDropdownOpen
                ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
                : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
            }`}
          >
            {enableLangSearch && (
              <input
                type="text"
                placeholder="Search language..."
                value={langSearch}
                onChange={(e) => setLangSearch(e.target.value)}
                className="mb-2 w-full p-1 border rounded bg-[var(--bg-color)] text-[var(--text-color)] border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600"
              />
            )}
            {filteredLanguages.map(({ code, label }) => (
              <button
                key={code}
                onClick={() => {
                  onLanguageChange(code);
                  setLangDropdownOpen(false);
                  setLangSearch('');
                }}
                className="block w-full text-left px-2 py-1 rounded transition-colors duration-150 hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={onToggleTheme}
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
          onClick={onToggleCursor}
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
              cursorSupported && cursorEnabled ? 'rainbow-star' : 'text-gray-400 dark:text-gray-600'
            }`}
          />
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
