<script lang="ts">
  import dayjs from 'dayjs'
  import { TIMELINE_DAY_SIZE } from '../constants/timeline'
  import { days } from '../stores/timeline'

  const today = dayjs()
</script>

<style>
  .days {
    padding: 10px 0;
    border-bottom: 1px solid;
    position: relative;
    z-index: 1;
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
    left: -1px;
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
  {#each $days as day}
    {@const week = day.date.week()}

    <div class="flex flex-col justify-end">
      {#if day.isFirstOfTheMonth}
        {@const month = day.date.format('MMMM').toUpperCase()}
        <div class="month">{month}</div>
      {/if}

      <div class="dayWrapper" class:weekStart={day.isStartOfWeek} style={`width: ${TIMELINE_DAY_SIZE}px;`}>
        {#if day.isStartOfWeek}
          <span class="weekOfYear" title={`Week ${week} of the year.`}>{week}</span>
        {/if}

        <div
          class="day white mx-1 flex-none rounded text-center"
          class:today={today.isSame(day.date, 'day')}
          class:weekend={day.isWeekend}
        >
          {day.label}
        </div>
      </div>
    </div>
  {/each}
</div>
