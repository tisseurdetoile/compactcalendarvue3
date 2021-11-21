<template>
  <WeekNumber 
    :day-of-week="lastDay" 
  />
  <WeekMonth 
    :day-of-week="lastDay" 
    :changed-month="changedMonth" 
  />
  <Day
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
import Day from './Day'

export default {
  components: { WeekNumber, WeekMonth, Day },  
  props: {
    week: Array,
    holidays: Array,
    vacations: Object
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
