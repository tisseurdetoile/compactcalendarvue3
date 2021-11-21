<template>
  <Calendar :weeks="calendar.weeks" :vacations="vacations" :holidays="holiday.days" :mondayfirst="calendar.mondayfirst" />
</template> 

<script>
import CalendarUtils from '../utils/CalendarUtils'
import { listDaysBetweenDays } from '../utils/DatesUtils.mjs'

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
      holiday: {},
      vacations: {}
    }
  },
  methods: {
    fetchData () {
      let url = './fr_fr/' + this.year + '.json'
      console.log(url)
      fetch(url, { method: 'get', headers: { 'content-type': 'application/json' }})
      .then(response => {
        console.log(response)
        return response.json();
      }, error =>{
        console.log("error1")
        console.log(error)
        throw new Error('Something went wrong');
    }).then(json => {
      this.holiday = json
      //let days = listDaysBetweenDays (new Date(this.holiday.vacation.zone1[0].start), new Date(this.holiday.vacation.zone1[0].end))
      let days = this.holiday.vacation.zone1.flatMap(x => listDaysBetweenDays(new Date(x.start), new Date(x.end)))

      // -- TODO a revoir
      var rObj = {}
      days.map (day => {
        let year = day.getFullYear()
        if (Object.prototype.hasOwnProperty.call(rObj, year)) {
          rObj[year].push(parseFloat(`${day.getMonth() + 1}.${day.toLocaleDateString(undefined, { day: '2-digit' })}`))
        } else {
          rObj[year] = [parseFloat(`${day.getMonth() + 1}.${day.toLocaleDateString(undefined, { day: '2-digit' })}`)]
        }
        return rObj
      })

      this.vacations = rObj

    }, error => { 
      console.log("error2")
      console.log(error)
      })
    }
  },
  props: {
    year: Number,
  },
  computed: {
    test: function () {
      return this.holiday.vacation.zone1.flatMap(x => listDaysBetweenDays(new Date(x.start), new Date(x.end)))
    },
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
