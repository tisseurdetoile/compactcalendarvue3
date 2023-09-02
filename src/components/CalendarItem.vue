<template>
  <ul class="mondayfirst">
    <WeekHeader :week="weeks[0]" />
    <WeekItem
      v-for="week in weeks"
      :key="week.id"
      :week="week"
      :vacations="vacations"
      :holidays="holidays"
    />
  </ul>
</template>
<script>
import WeekItem from "./week/WeekItem.vue";
import WeekHeader from "./week/WeekHeader.vue";
export default {
  components: { WeekItem, WeekHeader },
  props: {
    mondayfirst: Boolean,
    weeks: {
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
    holidays: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
};
</script>
