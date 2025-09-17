import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  SunMoon,
  Sun,
  Moon,
  Globe,
  Star,
  House,
  Info as InfoIcon,
  Construction,
} from 'lucide-react';

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

  const TOOLTIP_DELAY = 350;

  const iconMap = {
    '/': House,
    '/about': InfoIcon,
    '/experience': Construction,
  };

  const getIconForLink = (to) => iconMap[to] ?? House;

  const useDelayedTooltip = (delay = TOOLTIP_DELAY) => {
    const [showTooltip, setShowTooltip] = useState(false);
    const hoverTimer = useRef(null);

    const clearTooltipTimer = () => {
      if (hoverTimer.current) {
        clearTimeout(hoverTimer.current);
        hoverTimer.current = null;
      }
    };

    const startTooltipTimer = () => {
      hoverTimer.current = setTimeout(() => {
        hoverTimer.current = null;
        setShowTooltip(true);
      }, delay);
    };

    const hideTooltip = () => setShowTooltip(false);

    const handlePointerEnter = () => {
      clearTooltipTimer();
      startTooltipTimer();
    };

    const handlePointerLeave = () => {
      clearTooltipTimer();
      hideTooltip();
    };

    const handleFocus = () => {
      clearTooltipTimer();
      startTooltipTimer();
    };

    const handleBlur = () => {
      clearTooltipTimer();
      hideTooltip();
    };

    useEffect(() => () => clearTooltipTimer(), []);

    return {
      showTooltip,
      hideTooltip,
      eventHandlers: {
        onMouseEnter: handlePointerEnter,
        onMouseLeave: handlePointerLeave,
        onFocus: handleFocus,
        onBlur: handleBlur,
        onTouchStart: handlePointerEnter,
        onTouchEnd: handlePointerLeave,
        onTouchCancel: handlePointerLeave,
      },
    };
  };

  const Tooltip = ({ label, show }) => (
    <div
      role="tooltip"
      aria-hidden={!show}
      className={`pointer-events-none absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap rounded bg-gray-900 px-2 py-1 text-xs text-white opacity-0 transition-opacity duration-150 z-20 ${
        show ? 'opacity-90' : ''
      }`}
    >
      {label}
    </div>
  );

  const NavIconButton = ({ to, label }) => {
    const Icon = getIconForLink(to);
    const { showTooltip, hideTooltip, eventHandlers } = useDelayedTooltip();

    return (
      <div className="relative flex items-center">
        <Link
          to={to}
          aria-label={label}
          className="p-2 border rounded transition-colors duration-150 hover:bg-gray-200 dark:hover:bg-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-400 dark:focus-visible:ring-gray-600"
          {...eventHandlers}
          onClick={hideTooltip}
        >
          <Icon className="w-5 h-5" />
        </Link>
        <Tooltip label={label} show={showTooltip} />
      </div>
    );
  };

  const {
    showTooltip: showLangTooltip,
    hideTooltip: hideLangTooltip,
    eventHandlers: langTooltipHandlers,
  } = useDelayedTooltip();

  const {
    showTooltip: showThemeTooltip,
    hideTooltip: hideThemeTooltip,
    eventHandlers: themeTooltipHandlers,
  } = useDelayedTooltip();

  const {
    showTooltip: showCursorTooltip,
    hideTooltip: hideCursorTooltip,
    eventHandlers: cursorTooltipHandlers,
  } = useDelayedTooltip();

  const themeTooltipLabel =
    themeMode === 'dark' ? 'Light mode' : themeMode === 'light' ? 'Dark mode' : 'Auto theme';

  return (
    <nav
      className={`sticky top-0 z-50 flex justify-between items-center px-4 py-3 border-b transition-shadow bg-[var(--bg-color)] ${
        scrolled ? 'shadow-md' : ''
      }`}
    >
      <div className="flex items-center gap-2.5 justify-center">
        {links.map(({ to, label }) => (
          <NavIconButton key={to} to={to} label={label} />
        ))}
      </div>

      <div className="relative flex items-center gap-2">
        <div className="relative">
          <button
            type="button"
            aria-label="Change language"
            className="relative p-2 border rounded transition-colors duration-150 hover:bg-gray-200 dark:hover:bg-gray-700"
            {...langTooltipHandlers}
            onClick={() => {
              hideLangTooltip();
              setLangDropdownOpen((prev) => !prev);
            }}
          >
            <Globe className="w-5 h-5" />
            <span className="pointer-events-none absolute -bottom-1 -right-1 rounded bg-gray-900 px-1 text-[10px] font-semibold uppercase text-white shadow-md dark:bg-white dark:text-gray-900">
              {language.toUpperCase()}
            </span>
          </button>
          <Tooltip label="Change language" show={showLangTooltip} />
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

        <div className="relative flex items-center">
          <button
            type="button"
            aria-label="Toggle theme"
            className="p-2 border rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-150"
            {...themeTooltipHandlers}
            onClick={() => {
              hideThemeTooltip();
              onToggleTheme();
            }}
          >
            {themeMode === 'light' && <Sun className="w-5 h-5 text-yellow-600" />}
            {themeMode === 'dark' && <Moon className="w-5 h-5 text-white" />}
            {themeMode === 'auto' && (
              <SunMoon
                className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-300' : 'text-yellow-400'}`}
              />
            )}
          </button>
          <Tooltip label={themeTooltipLabel} show={showThemeTooltip} />
        </div>

        <div className="relative flex items-center">
          <button
            type="button"
            aria-label="Toggle interactive cursor"
            onClick={() => {
              hideCursorTooltip();
              onToggleCursor();
            }}
            disabled={!cursorSupported}
            className={`p-2 border rounded transition-colors duration-150 ${
              cursorSupported
                ? 'hover:bg-gray-200 dark:hover:bg-gray-700'
                : 'opacity-60 cursor-not-allowed'
            }`}
            {...cursorTooltipHandlers}
            aria-pressed={cursorEnabled}
          >
            <Star
              className={`w-5 h-5 ${
                cursorSupported && cursorEnabled ? 'rainbow-star' : 'text-gray-400 dark:text-gray-600'
              }`}
            />
          </button>
          <Tooltip label="Click it!" show={showCursorTooltip} />
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
