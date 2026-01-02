import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpBackend from "i18next-http-backend";
import { initReactI18next } from "react-i18next";

i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    supportedLngs: ["en"],
    debug: true,
    interpolation: {
      escapeValue: false,
    },
    backend: {
      loadPath: "/stridex/locales/{{lng}}.json",
    },
  });

export default i18n;
