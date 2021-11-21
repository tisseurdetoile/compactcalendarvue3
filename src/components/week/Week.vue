<template>
  <WeekNumber :dayOfWeek="lastDay"></WeekNumber>
  <WeekMonth :dayOfWeek="lastDay" :changedMonth="changedMonth"></WeekMonth>
  <Day
    v-for="day in week"
    :day="day"
    :changedMonth="changedMonth"
    :key="day.id"
    :holidays="this.holidays"
    :vacations="this.vacations"
  ></Day>
  <li></li>
</template>
<script>
import WeekNumber from './WeekNumber'
import WeekMonth from './WeekMonth'
import Day from './Day'

export default {
  props: {
    week: Array,
    holidays: Array,
    vacations: Object
  },
  components: { WeekNumber, WeekMonth, Day },
  computed: {
    changedMonth: function() {
      return this.week.find((day) => day.getDate() == 1) !== undefined
        ? true
        : false
    },
    lastDay: function() {
      return this.week[6]
    },
  },
}
</script>

<style scoped></style>
