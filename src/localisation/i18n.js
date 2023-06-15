import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import uk from './uk.json'; // Файл з мовними ресурсами для української мови
import en from './en.json'; // Файл з мовними ресурсами для англійської мови

i18n
    .use(initReactI18next)
    .init({
        resources: {
            en: {
                translation: en,
            },
            uk: {
                translation: uk,
            },
        },
        lng: 'en', // Виберіть початкову мову (англійська в цьому випадку)
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;
