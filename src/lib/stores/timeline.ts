import dayjs, { Dayjs } from 'dayjs'
import { derived, writable } from 'svelte/store'
import { user } from './auth'

// Start showing 70 days before just like the actual Toggl Plan
// export let timelineStartDate = writable(dayjs().subtract(70, 'days'))
export let timelineStartDate = writable(dayjs().subtract(6, 'days'))

// Start showing 68 days after just like the actual Toggl Plan
// export let timelineEndDate = writable(dayjs().add(68, 'days'))
export let timelineEndDate = writable(dayjs().add(16, 'days'))

type Day = {
  date: Dayjs
  label: string
  isFirstOfTheMonth: boolean
  isWeekend: boolean
  isStartOfWeek: boolean
}

export let days = derived(
  [timelineStartDate, timelineEndDate, user],
  ([$timelineStartDate, $timelineEndDate, $user]) => {
    const { hide_weekends: hideWeekends, start_of_week: startOfWeek } = $user.preferences
    const daysToShow = $timelineEndDate.diff($timelineStartDate, 'days')

    return Array.from({ length: daysToShow })
      .map((_, index) => {
        const date = $timelineStartDate.add(index, 'day')
        const isWeekend = [0, 6].includes(date.day())

        return {
          date,
          label: date.format('dd').substring(0, 1) + ' ' + date.format('D'),
          isFirstOfTheMonth: date.date() === 1,
          isWeekend,
          // Validating if start of the week is actually visible based of the user preferences (hide weekends setting),
          // and if it's not visible we assume that the start of the week is monday.
          isStartOfWeek:
            date.day() === startOfWeek || (hideWeekends && date.day() === 1 && [0, 6].includes(startOfWeek)),
        } satisfies Day
      })
      .filter((day) => {
        return !day.isWeekend || (day.isWeekend && !hideWeekends)
      })
  },
)
