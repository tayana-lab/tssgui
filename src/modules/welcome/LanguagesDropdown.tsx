import { StyledDropdown } from '@app/modules/common/default/components/common';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import TssIcon from '@app/modules/common/default/components/TssIcon';

export interface Language {
  key: string;
  icon: string;
  label: string;
}

const languages: Language[] = [
  {
    key: 'en',
    icon: 'flag-icon-in',
    label: 'topnavi.language.english',
  },
  {
    key: 'in',
    icon: 'flag-icon-de',
    label: 'topnavi.language.hindi',
  },
];


const LanguagesDropdown = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

const darkMode = useSelector((state) => state.ui.darkMode);


  const getCurrentLanguage = (): Language => {
    const currentLanguage = i18n.language;
    if (currentLanguage) {
      const language = languages.find(
        (language: Language) => language.key === currentLanguage
      );
      return language || languages[0];
    }
    return languages[0];
  };

  const isActiveLanguage = (language: Language) => {
    if (language) {
      return getCurrentLanguage().key === language.key ? 'active' : '';
    }
    return '';
  };


  return (
  
<StyledDropdown
  isOpen={dropdownOpen}
  hideArrow
  onMouseEnter={() => setDropdownOpen(true)}
  onMouseLeave={() => {
    setTimeout(() => setDropdownOpen(false), 150); 
  }}
>
  <div slot="head" className="mt-1 " style={{ cursor: 'pointer' }}>
    <TssIcon iconKey="tss_languageDropdown" title={t('topnavi.title.language')} />
  </div>

  <div slot="body" style={{ marginTop: '-8px' }}>
    {languages.map((language) => (
      <button
        type="button"
        key={language.key}
        className={`dropdown-item ${isActiveLanguage(language)}`}
        onClick={() => {
          changeLanguage(language.key);
          setDropdownOpen(false);
        }}
        style={{ cursor: 'pointer' }}
      >
        <i className={`flag-icon ${language.icon} mr-2`} />
        <span className="flag-name">{t(language.label)}</span>
      </button>
    ))}
  </div>
</StyledDropdown>

	);
};

export default LanguagesDropdown;
