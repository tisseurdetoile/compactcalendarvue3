<template>
  <CompactCalendar />
</template>

<script>
import CompactCalendar from './components/CompactCalendar.vue'

export default {
  name: 'App',
  components: {
    CompactCalendar,
  },
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
}
#app {
  font-family: monospace, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  font-size: 1em;
}
</style>
