<template>
  <WeekNumber :day-of-week="lastDay" />
  <WeekMonth :day-of-week="lastDay" :changed-month="changedMonth" />
  <DayItem
    v-for="day in week"
    :key="day.id"
    :day="day"
    :changed-month="changedMonth"
    :holidays="holidays"
    :vacations="vacations"
  />
  <li />
</template>
<script>
import WeekNumber from "./WeekNumber.vue";
import WeekMonth from "./WeekMonth.vue";
import DayItem from "./DayItem.vue";

export default {
  components: { WeekNumber, WeekMonth, DayItem },
  props: {
    week: {
      type: Array,
      default: () => {
        return [];
      },
    },
    holidays: {
      type: Array,
      default: () => {
        return [];
      },
    },
    vacations: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  computed: {
    changedMonth: function () {
      return this.week.find((day) => day.getDate() == 1) !== undefined
        ? true
        : false;
    },
    lastDay: function () {
      return this.week[6];
    },
  },
};
</script>
