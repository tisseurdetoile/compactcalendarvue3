<template>
  <div class="no-print source-picker">
    <label>
      {{ $t("message.source") }}
      <select v-model="dataSource">
        <option value="local">{{ $t("message.sourceLocal") }}</option>
        <option value="api">{{ $t("message.sourceApi") }}</option>
      </select>
    </label>
    &nbsp;
    <label v-if="dataSource === 'api'">
      {{ $t("message.holidayZone") }}
      <select v-model="holidayZone">
        <option v-for="zone in holidayZones" :key="zone.code" :value="zone.code">
          {{ zone.label }}
        </option>
      </select>
    </label>
  </div>
  <div v-for="zone in zones" :key="zone" class="no-print">
    <input v-model="currZone" name="currZone" type="radio" :value="zone" />
    <label>{{ zone }}</label>
  </div>
  <CalendarItem
    :weeks="calendar.weeks"
    :vacations="vacations"
    :holidays="holiday.days"
  />
</template>

<script>
import CalendarUtils from "../utils/CalendarUtils.js";
import { listDaysBetweenDays } from "../utils/DatesUtils.mjs";

import CalendarItem from "./CalendarItem.vue";

import {
  localJsonProvider,
  createApiProvider,
  HOLIDAY_ZONES,
  DEFAULT_HOLIDAY_ZONE,
} from "../services/holidayProviders.js";

function removewildcard(item) {
  return item !== "*";
}

// Clés utilisées pour retenir le choix de l'utilisateur d'une session à l'autre
const STORAGE_KEY_SOURCE = "compactcalendar.dataSource";
const STORAGE_KEY_HOLIDAY_ZONE = "compactcalendar.holidayZone";

function readPreference(key, fallback) {
  try {
    return window.localStorage.getItem(key) || fallback;
  } catch (e) {
    return fallback;
  }
}

function writePreference(key, value) {
  try {
    window.localStorage.setItem(key, value);
  } catch (e) {
    // stockage indisponible (mode privé, sandbox...) : on ignore
  }
}

export default {
  name: "CompactCalendar",
  components: { CalendarItem },
  props: {
    year: {
      type: Number,
      default: new Date().getFullYear(),
    },
  },
  data: () => {
    return {
      currZone: null,
      zones: [],
      holiday: {},
      vacations: {},
      // "local" (fichiers JSON du dépôt) ou "api" (data.gouv.fr)
      dataSource: readPreference(STORAGE_KEY_SOURCE, "local"),
      holidayZone: readPreference(STORAGE_KEY_HOLIDAY_ZONE, DEFAULT_HOLIDAY_ZONE),
      holidayZones: HOLIDAY_ZONES,
    };
  },
  computed: {
    calendar: function () {
      let dtStart = new Date(this.year, 0, 1, 13, 0, 0);
      let dtStop = new Date(this.year, 11, 31, 13, 0, 0);
      let cal = new CalendarUtils(dtStart, dtStop);
      return {
        weeks: cal.listDaysFromMonday(),
        mondayfirst: cal.getstartMonday(),
      };
    },
  },
  watch: {
    // call again the method if the year the zone or the locale change
    year: "fetchData",
    currZone: "loadZone",
    "$i18n.locale": "fetchData",
    dataSource: function (value) {
      writePreference(STORAGE_KEY_SOURCE, value);
      this.fetchData();
    },
    holidayZone: function (value) {
      writePreference(STORAGE_KEY_HOLIDAY_ZONE, value);
      if (this.dataSource === "api") {
        this.fetchData();
      }
    },
  },
  created() {
    this.fetchData();
  },
  methods: {
    loadZone() {
      if (this.currZone === null) {
        this.currZone = this.zones[0];
      }

      /**
       * On aggrege les jour commun dans "*" et les jours specifiques
       */
      let commonDays =
        this.holiday.vacation["*"] !== undefined
          ? this.holiday.vacation["*"]
          : [];
      let alldays = [...this.holiday.vacation[this.currZone], ...commonDays];

      let days = alldays.flatMap((x) =>
        listDaysBetweenDays(new Date(x.start), new Date(x.end)),
      );

      // -- TODO a revoir
      var rObj = {};
      days.map((day) => {
        let year = day.getFullYear();
        let floatDay = parseFloat(
          `${day.getMonth() + 1}.${day.toLocaleDateString(undefined, {
            day: "2-digit",
          })}`,
        );
        if (Object.prototype.hasOwnProperty.call(rObj, year)) {
          rObj[year].push(floatDay);
        } else {
          rObj[year] = [floatDay];
        }
        return rObj;
      });

      this.vacations = rObj;
    },
    async fetchData() {
      const locale = this.$i18n.locale;
      const provider =
        this.dataSource === "api"
          ? createApiProvider(this.holidayZone)
          : localJsonProvider;

      try {
        const holiday = await provider.load(this.year, locale);
        this.applyHoliday(holiday);
      } catch (error) {
        console.log(
          `no json data for year=${this.year} source=${this.dataSource} error:>${error}<`,
        );

        // Si l'API officielle est indisponible (hors-ligne, CORS, panne...),
        // on se rabat automatiquement sur les fichiers JSON locaux quand
        // ils existent, pour que le calendrier reste utilisable.
        if (this.dataSource === "api") {
          try {
            const fallbackHoliday = await localJsonProvider.load(
              this.year,
              locale,
            );
            this.applyHoliday(fallbackHoliday);
          } catch (fallbackError) {
            console.log(
              `fallback vers les fichiers locaux impossible error:>${fallbackError}<`,
            );
          }
        }
      }
    },
    applyHoliday(holiday) {
      this.holiday = holiday;
      this.zones = Object.keys(this.holiday.vacation).filter(removewildcard);
      this.loadZone();
    },
  },
};
</script>

<!-- style for all components -->
<style>
ul {
  overflow: hidden;
  color: black;
}

li {
  display: inline;
  text-align: center;
  vertical-align: middle;
  height: 1.1em;
}

li:nth-child(10n):after {
  display: block;
  content: "";
}

.mondayfirst li:nth-child(10n-1),
li:nth-child(10n-2) {
  color: grey;
}

.mondayfirst li.hday:nth-child(10n-1),
li.hday:nth-child(10n-2) {
  background-color: lightgray;
}

.header {
  color: white;
  background-color: gray;
}

.hweek,
.week {
  display: inline-block;
  width: 1.1em;
}

.hmonth,
.month {
  display: inline-block;
  width: 4em;
}

.hday,
.day {
  display: inline-block;
  width: 1.6em;
}

.holyday {
  color: orange;
}

.holydays {
  background-color: papayawhip;
}

.hidden {
  visibility: hidden;
}

.source-picker {
  margin-bottom: 0.5em;
}
</style>
