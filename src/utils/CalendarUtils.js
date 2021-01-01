export default class CalendarUtils {
  startDate
  endDate
  startMonday

  constructor(startDate, endDate, startMonday = true) {
    this.startDate = startDate
    this.endDate = endDate
    this.startMonday = startMonday
  }

  getstartMonday() {
    return this.startMonday
  }

  addDays(date, days) {
    var result = new Date(date)
    result.setDate(result.getDate() + days)
    return result
  }

  nextDay(date) {
    return this.addDays(date, 1)
  }

  getStartWeekMonday(date) {
    const offsetMonday = [-6, 0, -1, -2, -3, -4, -5]
    let monday = new Date(date)
    monday.setUTCHours(0, 0, 0, 0)
    let pos = offsetMonday[date.getDay()]
    monday.setDate(monday.getDate() + pos)
    return monday
  }

  getEndWeekSunday(date) {
    const offsetSunday = [0, 6, 5, 4, 3, 2, 1]
    let sunday = new Date(date)
    sunday.setUTCHours(0, 0, 0, 0)
    let pos = offsetSunday[date.getDay()]
    sunday.setDate(sunday.getDate() + pos)
    return sunday
  }

  listDays() {
    if (this.startMonday) {
      return this.listDaysFromMonday()
    } else {
      return []
    }
  }

  listDaysFromMonday() {
    const start = this.getStartWeekMonday(this.startDate)
    const end = this.getEndWeekSunday(this.endDate)

    let currDay = new Date(start)
    const dates = []
    let ni = 0
    let week = []
    while (currDay <= end) {
      week.push(new Date(currDay))
      currDay = this.nextDay(currDay)

      if (ni++ >= 6) {
        dates.push(week)
        week = []
        ni = 0
      }
    }
    return dates
  }

  static getWeekNumber(d) {
    // Copy date so don't modify original
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()))
    // Set to nearest Thursday: current date + 4 - current day number
    // Make Sunday's day number 7
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7))
    // Get first day of year
    var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
    // Calculate full weeks to nearest Thursday
    var weekNo = Math.ceil(((d - yearStart) / 86400000 + 1) / 7)
    // Return array of year and week number
    return [d.getUTCFullYear(), weekNo]
  }
}
