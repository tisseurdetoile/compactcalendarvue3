<template>
  <WeekNumber
    :day-of-week="lastDay"
  />
  <WeekMonth
    :day-of-week="lastDay"
    :changed-month="changedMonth"
  />
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
import WeekNumber from './WeekNumber'
import WeekMonth from './WeekMonth'
import DayItem from './DayItem'

export default {
  components: { WeekNumber, WeekMonth, DayItem },
  props: {
    week: {
      type: Array,
      default: () => []
    },
    holidays: {
      type: Array,
      default: () => []
    },
    vacations: {
      type: Object,
      default: () => {}
    },
  },
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
