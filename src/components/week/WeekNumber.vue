<template>
  <li class="week" :class="{ past: !elaspedDate }">
    {{ weekNumber }}
  </li>
</template>

<script>
import CalendarUtils from '../../utils/CalendarUtils'
export default {
  props: {
    dayOfWeek: Date,
  },
  computed: {
    weekNumber: function() {
      let numWeek = CalendarUtils.getWeekNumber(this.dayOfWeek)[1]
      if (numWeek < 10) {
        return '0' + numWeek
      }
      return '' + numWeek
    },
    elaspedDate: function() {
      let today = new Date()

      return today < this.dayOfWeek
    },
  },
}
</script>

<style scoped>
.past {
  border-left: 1px solid darkgray;
  color: rgb(47, 77, 77);
}
</style>
