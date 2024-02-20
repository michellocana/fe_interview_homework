<script lang="ts">
  import dayjs, { Dayjs } from 'dayjs'
  import { TIMELINE_DAY_SIZE } from '../constants/timeline'
  import { timelineEndDate, timelineStartDate } from '../stores/timeline'

  const daysToShow = $timelineEndDate.diff($timelineStartDate, 'days')
  const today = dayjs()

  type Day = {
    date: Dayjs
    label: string
    isFirstOfTheMonth: boolean
  }

  const days: Day[] = Array.from({ length: daysToShow }).map((_, index) => {
    const date = $timelineStartDate.add(index, 'day')

    return {
      date,
      label: date.format('dd').substring(0, 1) + ' ' + date.format('D'),
      isFirstOfTheMonth: date.date() === 1,
    }
  })
</script>

<style>
  .today {
    @apply bg-red-400;
    @apply text-white;
  }

  .month {
    font-size: 9px;
    @apply text-violet-600;
  }
</style>

<!-- TODO show week of year -->
<!-- TODO divide weeks -->

<div class="days flex">
  {#each days as { date, label, isFirstOfTheMonth }}
    <div class="dayWrapper flex flex-col justify-end">
      {#if isFirstOfTheMonth}
        <div class="month">
          {date.format('MMMM').toUpperCase()}
        </div>
      {/if}

      <div
        class="day white flex-none rounded text-center"
        class:today={today.isSame(date, 'day')}
        style={`width: ${TIMELINE_DAY_SIZE}px`}
      >
        {label}
      </div>
    </div>
  {/each}
</div>
