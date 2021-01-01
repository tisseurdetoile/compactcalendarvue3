<template>
  <li
    class="day"
    :class="{
      firstDay: firstDayOfMonth,
      startOfMonth: startOfMonth,
      endOfMonth: endOfMonth,
    }"
  >
    <span>
      {{ day.toLocaleDateString(undefined, { day: '2-digit' }) }}
    </span>
  </li>
</template>
<script>
export default {
  props: {
    day: Date,
    changedMonth: Boolean,
  },
  computed: {
    firstDayOfMonth: function() {
      return this.day.getDate() === 1
    },
    startOfMonth: function() {
      return this.day.getDate() <= 7 && this.changedMonth
    },
    endOfMonth: function() {
      return this.day.getDate() > 20 && this.changedMonth
    },
  },
}
</script>

<style scoped>
.firstDay {
  font-weight: bolder;
  background: linear-gradient(#9198e5, white);
  border-left: solid 1px#9198e5;
}
.startOfMonth {
  border-top: solid 1px#9198e5;
}
.endOfMonth {
  border-bottom: solid 1px#9198e5;
}
</style>
