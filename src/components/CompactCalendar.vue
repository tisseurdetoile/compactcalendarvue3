<template>
  <Weeks :weeks="weeks" :mondayfirst="mondayfirst" />
</template>

<script>
import Calendar from '../utils/Calendar'
import Weeks from './Weeks'
export default {
  name: 'HelloWorld',
  data: function() {
    let start = new Date('January 1, 2020 10:15:30')
    let stop = new Date('December 31, 2020 10:15:30')
    let cal = new Calendar(start, stop)
    return {
      weeks: cal.listDaysFromMonday(),
      mondayfirst: cal.getstartMonday(),
    }
  },
  components: { Weeks },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
ul {
  overflow: hidden;
  color: black;
}

li {
  display: inline;
  text-align: center;
  vertical-align: middle;
}

li:nth-child(10n):after {
  display: block;
  content: '';
}

.mondayfirst li:nth-child(10n-1),
li:nth-child(10n-2) {
  color: grey;
}

.mondayfirst li.hday:nth-child(10n-1),
li.hday:nth-child(10n-2) {
  background-color: lightgray;
}

.header {
  color: white;
  background-color: gray;
}

.hweek,
.week {
  display: inline-block;
  width: 1.8em;
}

.hmonth,
.month {
  display: inline-block;
  width: 4em;
}

.hday,
.day {
  display: inline-block;
  width: 1.6em;
}

.holyday {
  color: orange;
}

.holydays {
  background-color: papayawhip;
}

.hidden {
  visibility: hidden;
}
</style>
