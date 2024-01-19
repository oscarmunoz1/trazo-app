import enMessages from 'i18n/lang/en-US.json';
import es419Messages from 'i18n/lang/es-419.json';

export const defaultLocale = navigator.language;

export const locales = {
  // English translation message dictionary.
  'en-US': {
    name: 'English',
    messages: enMessages
  },
  en: {
    name: 'English',
    messages: enMessages
  },
  // Spanish translation message dictionary.
  'es-419': {
    name: 'Español',
    messages: es419Messages
  }
};
