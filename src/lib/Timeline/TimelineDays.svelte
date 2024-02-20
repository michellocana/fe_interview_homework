<script lang="ts">
  import dayjs, { Dayjs } from 'dayjs'
  import { TIMELINE_DAY_SIZE } from '../constants/timeline'
  import { timelineEndDate, timelineStartDate } from '../stores/timeline'
  import { user } from '../stores/auth'

  const daysToShow = $timelineEndDate.diff($timelineStartDate, 'days')
  const today = dayjs()

  type Day = {
    date: Dayjs
    label: string
    isFirstOfTheMonth: boolean
    isWeekend: boolean
    isStartOfWeek: boolean
  }

  let hideWeekends: boolean
  let startOfWeek: number
  let days: Day[]

  $: hideWeekends = $user.preferences.hide_weekends
  $: startOfWeek = $user.preferences.start_of_week
  $: days = Array.from({ length: daysToShow })
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
        isStartOfWeek: date.day() === startOfWeek || (hideWeekends && date.day() === 1 && [0, 6].includes(startOfWeek)),
      } satisfies Day
    })
    .filter((day) => {
      return !day.isWeekend || (day.isWeekend && !hideWeekends)
    })
</script>

<style>
  .days {
    padding: 10px 0;
    border-bottom: 1px solid;
    @apply border-slate-300;
    @apply shadow-md;
  }

  .day {
    @apply text-slate-800;
  }

  .today {
    @apply bg-red-400;
    @apply text-white;
  }

  .weekend {
    @apply text-slate-400;
  }

  .month {
    font-size: 9px;
    @apply mb-1;
    @apply text-violet-600;
  }

  .weekStart {
    position: relative;
  }

  .weekStart::after {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    margin: auto;
    height: 40%;
    width: 1px;
    @apply bg-slate-300;
  }

  .weekOfYear {
    position: absolute;
    top: 0;
    left: 0;
    transform: translate(-50%, -40%);
    font-size: 9px;
    @apply text-slate-400;
  }
</style>

<div class="days flex">
  {#each days as day}
    {@const week = day.date.week()}

    <div class="flex flex-col justify-end">
      {#if day.isFirstOfTheMonth}
        {@const month = day.date.format('MMMM').toUpperCase()}
        <div class="month">{month}</div>
      {/if}

      <div class="dayWrapper" class:weekStart={day.isStartOfWeek}>
        {#if day.isStartOfWeek}
          <span class="weekOfYear" title={`Week ${week} of the year.`}>{week}</span>
        {/if}

        <div
          class="day white m-1 flex-none rounded text-center"
          class:today={today.isSame(day.date, 'day')}
          class:weekend={day.isWeekend}
          style={`width: ${TIMELINE_DAY_SIZE}px`}
        >
          {day.label}
        </div>
      </div>
    </div>
  {/each}
</div>
