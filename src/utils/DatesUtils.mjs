    
function addDays(date, days) {
    var result = new Date(date)
    result.setDate(result.getDate() + days)
    return result
  }

function nextDay(date) {
    return addDays(date, 1)
}

function listDaysBetweenDays(startDate, endDate) {
  let currDay = new Date(startDate)
  const dates = []
  while (currDay <= endDate) {
    dates.push(new Date(currDay))
    currDay = nextDay(currDay)
  }
  return dates
}

function listWeekDaysBetweenDays(startDate, endDate) {
  let currDay = new Date(startDate)
  const dates = []
  let ni = 0
  let week = []
  while (currDay <= endDate) {
    week.push(new Date(currDay))
    currDay = nextDay(currDay)
    
    if (ni++ >= 6) {
      dates.push(week)
      week = []
      ni = 0
    }
  }
  return dates
}

export { listDaysBetweenDays, listWeekDaysBetweenDays }