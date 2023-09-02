<template>
  <li class="header hweek">#</li>
  <li class="header hmonth">mois</li>
  <li v-for="day in week" :key="day.id" class="header hday">
    <span>{{ day.toLocaleDateString(undefined, { weekday: "narrow" }) }}</span>
  </li>
  <li />
</template>
<script>
export default {
  props: {
    week: {
      type: Array,
      default: () => {
        return [];
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
