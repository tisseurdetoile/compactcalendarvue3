<template>
  <div>
    <div>
      <button
        class="no-print"
        @click="minus"
      >
        &#xFE64;
      </button>
      &nbsp;-&nbsp;<a :href="'./?year=' + currentYear">
        {{ currentYear }}
      </a>
      &nbsp;-&nbsp;
      <button
        class="no-print"
        @click="plus"
      >
        &#xFE65;
      </button>
    </div>
    <CompactCalendar :year="currentYear" />

    <footer class="no-print">
      <div class="wrapper">
        <div class="footer-menu">
          <p>
            <a href="https://davidseah.com/node/compact-calendar/">
              CompactCalendar
            </a>
            <br>
            <a href="https://davidseah.com/blog/grid-all/">DavidSeah Blog</a>
            <br>
            <a href="https://blog.tisseurdetoile.net">TisseurDeToile</a>
            <br>
            <a
              href="https://github.com/tisseurdetoile/compactcalendarvue3/issues"
            >
              An idea
            </a>
          </p>
        </div>

        <div class="about">
          <div class="colophon">
            <p>
              CompactCalendarVue is an Vue application <br>
              CompactCalendar is a creation of
              <a href="https://davidseah.com/">David Seah</a><br>
              Adapted in <a herf="https://vuejs.org/">Vue</a> by
              <a href="http://www.tisseurdetoile.net/">Le TisseurDeToile</a>
            </p>
          </div>
          <div class="copyright">
            <p>
              © 2021
              <a href="https://davidseah.com/">David Seah</a>
            </p>
            <p>
              © 2021
              <a href="http://www.tisseurdetoile.net/">Le TisseurDeToile</a>
            </p>
          </div>
        </div>
      </div>
    </footer>
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
    parameters: function() {
      return new URLSearchParams(window.location.search)
    },
    currentYear: function() {
      if (this.selectedYear === null) {
        let urlYear = null

        if (this.parameters.get('year') !== null) {
          urlYear = parseInt(this.parameters.get('year'))
        }

        if (this.parameters.get('annee') !== null) {
          urlYear = parseInt(this.parameters.get('annee'))
        }

        if (urlYear !== null) {
          return urlYear
        }

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

#app {
  font-family: monospace, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  font-size: 1em;
}

footer {
  display: table-row;
  height: 1px;
  background-color: transparent;
}

footer a,
footer a:visited,
footer a:hover,
footer a:active {
  color: white;
}

footer .wrapper {
  display: table;
  float: unset;
  background-color: #282d32;
  color: white;
  padding: 40px 0;
}

footer .wrapper .footer-menu {
  display: table-cell;
  text-align: right;
  width: 180px;
}

footer .wrapper .footer-menu ul {
  list-style-type: none;
}

footer .wrapper .footer-menu ul li {
  display: inline;
  text-align: right;
}

footer .wrapper .about {
  display: table-cell;
  width: 800px;
  padding-left: 70px;
}

footer .wrapper .colophon {
  width: 500px;
}

footer .wrapper .copyright {
  margin-top: 24px;
  width: 500px;
}

@media print {
  * {
    margin: 0;
    padding: 0;
  }

  .no-print,
  .no-print * {
    display: none !important;
  }

  body {
    -webkit-print-color-adjust: exact; /*Chrome, Safari */
    print-color-adjust: exact; /*Firefox*/
  }

  #app {
    font-family: sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: left;
    font-size: 1em;
  }
}
</style>
