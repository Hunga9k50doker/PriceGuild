import i18n from "i18next";
import commonEn from "translations/en/common.json";
import commonVi from "translations/vi/common.json";

const ISSERVER = typeof window === "undefined";

(async () => {
  let langCode = "vi"
  if (!ISSERVER) {
    langCode = localStorage.getItem('langCode') || 'vi'
  }

  i18n
    .init({
      interpolation: { escapeValue: false },
      lng: langCode,
      resources: {
        en: {
          common: commonEn,
        },
        vi: {
          common: commonVi,
        },
      },
    })
    .catch((e) => {
      console.log(e);
    });
})();

export default i18n;
