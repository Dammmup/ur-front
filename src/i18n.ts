import i18n from 'i18next';
import { initReactI18next } from '../node_modules/react-i18next';

const resources = {
  en: { translation: { 'Welcome': 'Welcome to Uyghur Connect!' } },
  ru: { translation: { 'Welcome': 'Добро пожаловать на Uyghur Connect!' } },
  fr: { translation: { 'Welcome': 'Bienvenue sur Uyghur Connect!' } },
  sv: { translation: { 'Welcome': 'Välkommen till Uyghur Connect!' } },
  kk: { translation: { 'Welcome': 'Uyghur Connect-ке қош келдіңіз!' } },
  tr: { translation: { 'Welcome': 'Uyghur Connect’e hoş geldiniz!' } },
  ug: { translation: { 'Welcome': 'ئۇيغۇر كۇننېكت تور بېكىتىگە خۇش كەپسىز!' } },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    lng: navigator.language.split('-')[0],
    interpolation: { escapeValue: false },
    supportedLngs: ['en', 'ru', 'fr', 'sv', 'kk', 'tr', 'ug'],
  });

export default i18n;
