import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpApi from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(HttpApi) // Загружает переводы с вашего сервера/папки public
  .use(LanguageDetector) // Определяет язык пользователя
  .use(initReactI18next) // Передает экземпляр i18n в react-i18next
  .init({
    fallbackLng: 'sv', // Язык по умолчанию, если язык пользователя не доступен
    debug: false, // Включает логирование в консоль для разработки
    supportedLngs: ['en', 'ru', 'fr', 'sv'], // Список поддерживаемых языков
    ns: 'translations', // Пространство имен по умолчанию
    defaultNS: 'translations',
    backend: {
      loadPath: '/locales/{{lng}}/translations.json', // Путь к файлам переводов
    },
    interpolation: {
      escapeValue: false, // React уже защищает от XSS
    },
    detection: {
      order: ['queryString', 'cookie', 'localStorage', 'sessionStorage', 'navigator', 'htmlTag'],
      caches: ['cookie', 'localStorage'],
    },
  });

export default i18n;
