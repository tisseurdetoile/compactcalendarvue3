import CalendarUtils from '../CalendarUtils'

describe('Calendar Test', () => {
  const MARS = 2

  test('Annee 2021', () => {
    let start = new Date('January 1, 2021 10:15:30')
    let stop = new Date('December 31, 2021 10:15:30')

    let cal = new CalendarUtils(start, stop)
    let res = cal.listDaysFromMonday()
    expect(res.length).toEqual(53)
  })

  test('Annee 2020', () => {
    let start = new Date('January 1, 2020 10:15:30')
    let stop = new Date('December 31, 2020 10:15:30')

    let cal = new CalendarUtils(start, stop)
    let res = cal.listDaysFromMonday()

    expect(res.length).toEqual(53)
  })

  test('Test sur une semaine', () => {
    let start = new Date('November 18, 2020 10:15:30')
    let stop = new Date('November 19, 2020 10:15:30')

    let cal = new CalendarUtils(start, stop)
    let res = cal.listDaysFromMonday()

    expect(res[0].length).toEqual(7)
  })

  test('Fevrier 2020', () => {
    let start = new Date('February 25, 2020 10:15:30')
    let stop = new Date('February 26, 2020 10:15:30')

    let cal = new CalendarUtils(start, stop)
    let res = cal.listDaysFromMonday()

    expect(res[0].length).toEqual(7)
    expect(res[0][6].getMonth()).toEqual(MARS)
    expect(res[0][5].getDate()).toEqual(29)
  })
  test('Fevrier 2019', () => {
    let start = new Date('February 25, 2019 10:15:30')
    let stop = new Date('February 26, 2019 10:15:30')

    let cal = new CalendarUtils(start, stop)
    let res = cal.listDaysFromMonday()

    expect(res[0].length).toEqual(7)
    expect(res[0][3].getDate()).toEqual(28)
    expect(res[0][6].getMonth()).toEqual(MARS)
  })
})
