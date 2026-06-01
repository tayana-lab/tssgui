import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import {useEffect} from 'react';
import translationEN from '@app/locales/en/TssTranslation.json';
import translationIN from '@app/locales/in/TssTranslation.json';

const resources = {
  en: {
    translation:
              { ...translationEN,
              },
  },
  in: {
    translation: 
              { ...translationIN,
              },
    },
};

i18n
  .use(initReactI18next as any) // passes i18n down to react-i18next
  .init({
    resources,
    lng:"en",
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
    react: {
      wait: true,
    },
  } as any);

export default i18n;
