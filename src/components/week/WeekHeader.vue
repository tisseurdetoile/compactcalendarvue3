<template>
  <li class="header hweek">#</li>
  <li class="header hmonth">{{ $t("libelle.mois") }}</li>
  <li v-for="day in week" :key="day.id" class="header hday">
    <span>{{ day.toLocaleDateString(undefined, { weekday: "narrow" }) }}</span>
  </li>
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
};
</script>
