<template>
  <Calendar :weeks="calendar.weeks" :mondayfirst="calendar.mondayfirst" />
</template>

<script>
import CalendarUtils from '../utils/CalendarUtils'
import Calendar from './Calendar'
export default {
  name: 'CompactCalendar',
  components: { Calendar },
  created() {
    this.fetchData()
  },
    watch: {
    // call again the method if the year change
    'year': 'fetchData'
  },
  data: function () {
    return {
      resp: {}
    }
  },
  methods: {
    fetchData () {
      let url = './fr_fr/' + this.year + '.json'
      console.log(url)
      fetch(url,  { method: 'get', headers: { 'content-type': 'application/json' }})
      .then(response => {
        console.log(response)
        return response.json();
      }, error =>{
        console.log(error)
        throw new Error('Something went wrong');
    }).then(json => {this.resp = json})
    }
  },
  props: {
    year: Number,
  },
  computed: {
    calendar: function() {
      let dtStart = new Date(this.year, 0, 1, 13, 0, 0)
      let dtStop = new Date(this.year, 11, 31, 13, 0, 0)
      let cal = new CalendarUtils(dtStart, dtStop)
      return {
        weeks: cal.listDaysFromMonday(),
        mondayfirst: cal.getstartMonday(),
      }
    },
  },
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
  height: 1.1em;
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
  width: 1.1em;
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
