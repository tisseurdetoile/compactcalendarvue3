<template>
  <div>
    <div class="no-print">
      <button v-on:click="minus">&#xFE64;</button> - {{ currentYear }} -
      <button v-on:click="plus">&#xFE65;</button>
    </div>
    <CompactCalendar :year="currentYear" />
  </div>
</template>

<script>
import CompactCalendar from './components/CompactCalendar.vue'

export default {
  name: 'App',
  components: {
    CompactCalendar,
  },
  data: function() {
    return {
      selectedYear: null,
    }
  },
  computed: {
    currentYear: function() {
      if (this.selectedYear === null) {
        let dt = new Date()
        return dt.getFullYear()
      }
      return this.selectedYear
    },
  },
  methods: {
    minus: function() {
      if (this.selectedYear === null) {
        this.selectedYear = this.currentYear
      }

      this.selectedYear--
    },
    plus: function() {
      if (this.selectedYear === null) {
        this.selectedYear = this.currentYear
      }

      this.selectedYear++
    },
  },
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
}

@media print {
  .no-print,
  .no-print * {
    display: none !important;
  }

  body {
    -webkit-print-color-adjust: exact; /*Chrome, Safari */
    color-adjust: exact; /*Firefox*/
  }
}

#app {
  font-family: monospace, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  font-size: 1em;
}
</style>
