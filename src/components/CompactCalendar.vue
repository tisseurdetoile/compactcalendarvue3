<template>
  <div v-for="zone in zones" :key="zone" class="no-print">
    <input v-model="currZone" name="currZone" type="radio" :value="zone" />
    <label>{{ zone }}</label>
  </div>
  <CalendarItem
    :weeks="calendar.weeks"
    :vacations="vacations"
    :holidays="holiday.days"
    :mondayfirst="calendar.mondayfirst"
  />
</template>

<script>
import CalendarUtils from "../utils/CalendarUtils.js";
import { listDaysBetweenDays } from "../utils/DatesUtils.mjs";

import CalendarItem from "./CalendarItem.vue";

export default {
  name: "CompactCalendar",
  components: { CalendarItem },
  props: {
    year: {
      type: Number,
      default: new Date().getFullYear(),
    },
  },
  data: function () {
    return {
      currZone: null,
      zones: [],
      holiday: {},
      vacations: {},
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
    // call again the method if the year change
    year: "fetchData",
    currZone: "loadZone",
  },
  created() {
    this.fetchData();
  },
  methods: {
    loadZone() {
      if (this.currZone === null) {
        this.currZone = this.zones[0];
      }

      let days = this.holiday.vacation[this.currZone].flatMap((x) =>
        listDaysBetweenDays(new Date(x.start), new Date(x.end))
      );

      // -- TODO a revoir
      var rObj = {};
      days.map((day) => {
        let year = day.getFullYear();
        let floatDay = parseFloat(
          `${day.getMonth() + 1}.${day.toLocaleDateString(undefined, {
            day: "2-digit",
          })}`
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
    fetchData() {
      let url = `./${navigator.language.slice(-2).toLowerCase()}/${
        this.year
      }.json`;
      fetch(url, {
        method: "get",
        headers: { "content-type": "application/json" },
      })
        .then(
          (response) => {
            return response.json();
          },
          (error) => {
            throw new Error(`Something went wrong e=${error}`);
          }
        )
        .then(
          (json) => {
            this.holiday = json;
            this.zones = Object.keys(this.holiday.vacation);
            this.loadZone();
          },
          (error) => {
            console.log(`no json data for ${url} error:>${error}<`);
          }
        );
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
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
</style>
