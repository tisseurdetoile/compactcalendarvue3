<template>
  <ul class="mondayfirst">
    <WeekHeader :week="weeks[0]" />
    <Week v-for="week in weeks" :week="week" 
      :vacations="this.vacations" 
      :holidays="this.holidays" 
      v-bind:key="week.id">
    </Week>
  </ul>
</template>
<script>
import Week from './week/Week'
import WeekHeader from './week/WeekHeader'
export default {
  components: { Week, WeekHeader },
  props: {
    weeks: Array,
    mondayfirst: Boolean,
    vacations: {
      type: Object,
      default: function() {
        return {}
        }
      },
    holidays: {
      type: Array,
      default: function() {
        return []
        }
      }
  },
}
</script>

<style scoped></style>
