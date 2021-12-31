<template>
  <li 
    :class="{ hidden: !changedMonth }"
    class="month"
  >
    {{ weekMonth }}
  </li>
</template>

<script>
export default {
  props: {
    dayOfWeek: Date,
    changedMonth: Boolean,
  },
  computed: {
    weekMonth: function() {
      const optionsMonth = {
        month: 'short',
      }
      let shrtMonth = this.dayOfWeek.toLocaleDateString(undefined, optionsMonth)

      if (shrtMonth.length < 6) {
        let pad = 5 - shrtMonth.length

        let space = ' '.repeat(pad)
        return shrtMonth + space
      }
      return shrtMonth
    },
  },
}
</script>

<style lang="scss" scoped></style>
