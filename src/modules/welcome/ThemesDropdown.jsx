import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon, faSeedling } from '@fortawesome/free-solid-svg-icons';
import { toggleDarkMode, toggleBlueMode } from '@app/modules/common/default/store/reducers/ui';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import TssIcon from '@app/modules/common/default/components/TssIcon';

const ThemesDropdown = () => {
  const dispatch = useDispatch();
  const [t] = useTranslation();
  const darkMode = useSelector((state) => state.ui.darkMode);
  const blueMode = useSelector((state) => state.ui.blueMode);
  const [isHovered, setIsHovered] = useState(false);

  /* ---- Business logic — unchanged ---- */
  const handleDarkModeChange = (mode) => {
    if (darkMode !== mode) dispatch(toggleDarkMode());
  };

  const handleBlueModeChange = (mode) => {
    if (blueMode !== mode) dispatch(toggleBlueMode());
  };

  const handleLightMode = () => {
    if (darkMode) dispatch(toggleDarkMode());
    if (blueMode) dispatch(toggleBlueMode());
  };

  return (
    <div
      className="relative flex items-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Trigger button */}
      <button
        type="button"
        className="tss-topbar-icon-btn"
        title={t('topnavi.title.theme')}
        aria-label={t('topnavi.title.theme')}
        aria-haspopup="true"
        aria-expanded={isHovered}
      >
        <TssIcon
          iconKey={darkMode ? 'tss_darkTheme' : 'tss_lightTheme'}
          title={t('topnavi.title.theme')}
        />
      </button>

      {/* Dropdown panel */}
      {isHovered && (
        <div
          className="tss-dropdown"
          style={{ top: '36px', right: 0, position: 'absolute' }}
          role="menu"
          aria-label="Theme selector"
        >
          {/* Light */}
          <button
            type="button"
            role="menuitem"
            className={`tss-dropdown-item w-full${!darkMode && !blueMode ? ' font-semibold' : ''}`}
            onClick={handleLightMode}
          >
            <FontAwesomeIcon icon={faSun} className="w-4 text-amber-500" />
            <span>Light</span>
            {!darkMode && !blueMode && (
              <span
                className="ml-auto w-2 h-2 rounded-full"
                style={{ backgroundColor: 'var(--color-primary)' }}
                aria-hidden="true"
              />
            )}
          </button>

          {/* Dark */}
          <button
            type="button"
            role="menuitem"
            className={`tss-dropdown-item w-full${darkMode ? ' font-semibold' : ''}`}
            onClick={() => handleDarkModeChange(true)}
          >
            <FontAwesomeIcon icon={faMoon} className="w-4 text-indigo-400" />
            <span>Dark</span>
            {darkMode && (
              <span
                className="ml-auto w-2 h-2 rounded-full"
                style={{ backgroundColor: 'var(--color-primary)' }}
                aria-hidden="true"
              />
            )}
          </button>

          {/* Blue */}
          <button
            type="button"
            role="menuitem"
            className={`tss-dropdown-item w-full${blueMode ? ' font-semibold' : ''}`}
            onClick={() => handleBlueModeChange(true)}
          >
            <FontAwesomeIcon icon={faSeedling} className="w-4 text-blue-500" />
            <span>Blue</span>
            {blueMode && (
              <span
                className="ml-auto w-2 h-2 rounded-full"
                style={{ backgroundColor: 'var(--color-primary)' }}
                aria-hidden="true"
              />
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default ThemesDropdown;
