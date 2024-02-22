import type { Dayjs } from 'dayjs'

export default function diffWeekDays(from: Dayjs, to: Dayjs) {
  const diff = Math.ceil(to.diff(from, 'day', true)) - 1
  let weekDaysDiff = diff

  for (let index = from.day(); index <= from.day() + diff; index++) {
    const day = index % 7

    if ([0, 6].includes(day)) {
      weekDaysDiff--
    }
  }

  return weekDaysDiff
}
