import { TextModes } from '@vue/compiler-core'

export interface IDate {
  year: number
  month: number
  date?: number
}

export interface IDateItem {
  date: Date
  currentMonth: boolean
  currentDate?: boolean
}

const OFFSET_TIMESTAMP = 1000 * 60 * 60 * 24

export const getFirstDayOfMonth = ({ year, month }: IDate) => {
  return new Date(year, month - 1, 1)
}

export const getLastDayOfMonth = ({ year, month }: IDate) => {
  return new Date(year, month, 0)
}

export const getDate = (_date: Date): IDate => {
  const year = _date.getFullYear()
  const month = _date.getMonth() + 1
  const date = _date.getDate()
  return { year, month, date }
}

export const getPreMonthDays = (date: Date) => {
  const res: IDateItem[] = []
  const _date = getDate(date)
  const first_date = getFirstDayOfMonth(_date)
  const firstDate = new Date(_date.year, _date.month - 1, first_date.getDate())
  const offsetDays = firstDate.getDay()
  for (let i = 1; i <= offsetDays; i++) {
    const tempDate = new Date(firstDate.getTime() - i * OFFSET_TIMESTAMP)
    res.unshift({
      date: tempDate,
      currentMonth: false
    })
  }
  return res
}

const isCurrentDate = (date: Date) => {
  const _date = new Date()
  return (
    _date.getFullYear() === date.getFullYear() &&
    _date.getMonth() === date.getMonth() &&
    _date.getDate() === date.getDate()
  )
}

export const getCurrentMonthDays = (date: Date) => {
  const res: IDateItem[] = []
  const _date = getDate(date)
  const days = getLastDayOfMonth(_date).getDate()
  for (let i = 1; i <= days; i++) {
    const tempDate = new Date(_date.year, _date.month - 1, i)
    res.push({
      date: tempDate,
      currentMonth: true,
      currentDate: isCurrentDate(tempDate)
    })
  }
  return res
}

export const getNextMonthDays = (date: Date) => {
  const res: IDateItem[] = []
  const _date = getDate(date)
  const last_date = getLastDayOfMonth(_date)
  const lastDate = new Date(_date.year, _date.month - 1, last_date.getDate())
  const offsetDays = 6 - lastDate.getDay() || 7
  for (let i = 1; i <= offsetDays; i++) {
    const tempDate = new Date(lastDate.getTime() + i * OFFSET_TIMESTAMP)
    res.push({
      date: tempDate,
      currentMonth: false
    })
  }
  return res
}

export const getAllDate = (date: Date): Array<Array<IDateItem>> => {
  const allDate = [
    ...getPreMonthDays(date),
    ...getCurrentMonthDays(date),
    ...getNextMonthDays(date)
  ]
  const monthDays: Array<Array<IDateItem>> = []
  const weeks = allDate.length / 7
  for (let i = 0; i < weeks; i++) {
    monthDays.push(allDate.slice(i * 7, (i + 1) * 7))
  }
  return monthDays
}
