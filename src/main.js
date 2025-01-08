import { createApp } from "vue";
import { createI18n } from "vue-i18n";

const i18n = createI18n({
  locale: "fr",
  fallbackLocale: "fr",
  messages: {
    fr: {
      libelle: {
        mois: "mois",
      },
      message: {
        infoL1: "CompactCalendarVue est une application en Vue3",
        infoL2: "CompactCalendar est une creation de",
        infoL3: "Adapté en Vue3 par",
        participer: "Participer",
        copyright: "© 2021-2025",
      },
    },
    en: {
      libelle: {
        mois: "month",
      },
      message: {
        infoL1: "CompactCalendarVue is an Vue3 application",
        infoL2: "CompactCalendar is a creation of",
        infoL3: "Adapted in Vue by",
        participer: "An idea",
        copyright: "© 2021-2025",
      },
    },
    sv: {
      libelle: {
        mois: "månad",
      },
      message: {
        infoL1: "CompactCalendarVue är en Vue3-applikation",
        infoL2: "CompactCalendar är en skapelse av",
        infoL3: "Anpassad i Vue by",
        participer: "En idé",
        copyright: "© 2021-2025",
      },
    },
  },
});

import App from "@/App.vue";

const app = createApp(App);
app.use(i18n);
app.mount("#app");
