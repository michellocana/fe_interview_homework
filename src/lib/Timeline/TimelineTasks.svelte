<script lang="ts">
  import dayjs from 'dayjs'
  import { DEFAULT_TASK_COLOR, TASK_COLORS } from '../constants/colors'
  import { TIMELINE_DAY_SIZE, TIMELINE_START_ROW } from '../constants/timeline'
  import { days, timelineStartDate } from '../stores/timeline'
  import type { TasksResponse } from '../types/network'
  import TimelineTask from './TimelineTask.svelte'
  import type { TaskDisposition } from '../types/timeline'
  import type { Task } from '../types/plan'

  export let tasks: TasksResponse
  export let onTaskDragEnd: (task: Task, x: number, y: number) => void = () => {}

  let maxRow: number
  let tasksDisposition: TaskDisposition[]

  $: {
    const fullDisposition = Array.from({ length: $days.length }).map<Task[]>((a) => [])

    tasksDisposition = Array.from({ length: tasks.length }).map<TaskDisposition>(() => ({
      row: 0,
      columnStart: 0,
      columnEnd: 0,
    }))

    tasks.forEach((task, taskIndex) => {
      const taskStartDate = dayjs(task.start_date)
      const taskEndDate = dayjs(task.end_date)
      const columnStart = Math.ceil(taskStartDate.diff($timelineStartDate, 'day', true)) + 1
      const columnEnd = columnStart + taskEndDate.diff(taskStartDate, 'day') + 1

      const partialStart = columnStart - 1
      const partialEnd = columnEnd - 1

      const partialDisposition = fullDisposition.slice(partialStart, partialEnd)

      const rowPossibilities = Math.max(...partialDisposition.map((arr) => arr.length))

      let row: number | null = null

      for (let index = 0; index < rowPossibilities; index++) {
        // Check if the task fits in the remaining space
        const hasRoomToFit = partialDisposition.every((column) => !column[index])

        // Sometimes the task might fit in the space that is empty, but the task weight
        // is bigger than the limit, so we just skip the task in that case
        const hasProperWeight = partialDisposition.every((column) => {
          const nextRows = column.slice(index + 1)
          return nextRows.every((currentTask) => currentTask.weight >= task.weight)
        })

        if (hasRoomToFit && hasProperWeight) {
          row = index
        }
      }

      if (row === null) {
        row = Math.max(...partialDisposition.map((arr) => arr.length))
      }

      for (let index = partialStart; index < partialEnd; index++) {
        if (fullDisposition[index]) {
          fullDisposition[index][row] = task
        }
      }

      // We always increase the row by one because to convert an array index into a css grid row (0 -> 1, 1 -> 2, etc)
      tasksDisposition[taskIndex].row = row + TIMELINE_START_ROW + 1
      tasksDisposition[taskIndex].columnStart = columnStart
      tasksDisposition[taskIndex].columnEnd = columnEnd
    })

    maxRow = Math.max(...tasksDisposition.map((disposition) => disposition.row))
  }
</script>

<style lang="postcss">
  .wrapper {
    position: relative;
  }

  .gridWrapper {
    display: grid;
    grid-template-columns: repeat(var(--grid-columns), calc(var(--grid-column-size) * 1px));
  }

  .days {
    position: absolute;
    inset: 0;
  }

  .tasks {
    grid-template-rows: repeat(var(--grid-rows), 50px);
    position: relative;
    z-index: 1;
  }

  .day {
    border-right: 1px solid;
    grid-row: 1 / -1;
    grid-column: var(--day-column);
    @apply border-slate-300;
  }

  .dayIsWeekend {
    @apply bg-slate-200 bg-opacity-60;
  }

  .dayIsToday {
    @apply bg-orange-300 bg-opacity-30;
  }
</style>

<div class="wrapper flex-1">
  <div class="gridWrapper days">
    {#each $days as day, index}
      <div
        class="day bg-slate-50"
        class:dayIsWeekend={day.isWeekend}
        class:dayIsToday={day.isToday}
        style="--day-column: {index + 1}"
      ></div>
    {/each}
  </div>

  <div
    class="gridWrapper tasks"
    style="--grid-rows: {maxRow}; --grid-columns: {$days.length}; --grid-column-size: {TIMELINE_DAY_SIZE}"
  >
    {#each tasks as task, index}
      {@const disposition = tasksDisposition[index]}
      <TimelineTask {task} {disposition} onDragEnd={(x, y) => onTaskDragEnd(task, x, y)} />
    {/each}
  </div>
</div>
