<template>
  <li
    class="day"
    :class="{
      firstDay: firstDayOfMonth,
      startOfMonth: startOfMonth,
      endOfMonth: endOfMonth,
      holyday: isHolyDay,
      vacation: isVacation
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
    vacations: {
      type: Object,
      default: () => {}
    },
    holidays: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    isVacation: function(){
      let floatDate = parseFloat(`${this.day.getMonth() + 1}.${this.day.toLocaleDateString(undefined, { day: '2-digit' })}`)

      if (Object.prototype.hasOwnProperty.call(this.vacations, this.day.getFullYear())) {
          return this.vacations[this.day.getFullYear()].includes(floatDate)
      }

      return false

    },
    isHolyDay: function() {
      let floatDate = parseFloat(`${this.day.getMonth() + 1}.${this.day.toLocaleDateString(undefined, { day: '2-digit' })}`)
      return this.holidays.includes(floatDate)
    },
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
.vacation {
  background: lightgrey;
}

.firstDay {
  font-weight: bolder;
  background: linear-gradient(#9198e5, white);
  border-left: solid 1px #9198e5;
}
.startOfMonth {
  border-top: solid 1px #9198e5;
}
.endOfMonth {
  border-bottom: solid 1px #9198e5;
}

.holyday {
  font-weight: bolder;
  color: darkorange;
}
</style>
