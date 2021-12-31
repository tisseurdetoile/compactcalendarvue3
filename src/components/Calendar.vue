<template>
  <ul class="mondayfirst">
    <WeekHeader :week="weeks[0]" />
    <Week 
      v-for="week in weeks"
      :key="week.id"
      :week="week" 
      :vacations="vacations" 
      :holidays="holidays" 
    />
  </ul>
</template>
<script>
import Week from './week/Week'
import WeekHeader from './week/WeekHeader'
export default {
  components: { Week, WeekHeader },
  props: {
    mondayfirst: Boolean,    
    weeks: {
      type: Array,
      default: function() {
        return []
        }
      },
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
