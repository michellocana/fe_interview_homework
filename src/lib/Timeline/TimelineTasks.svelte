<script lang="ts">
  import dayjs from 'dayjs'
  import { TASK_COLORS } from '../constants/colors'
  import { TIMELINE_DAY_SIZE, TIMELINE_START_ROW } from '../constants/timeline'
  import { days, timelineStartDate } from '../stores/timeline'
  import type { TasksResponse } from '../types/network'

  export let tasks: TasksResponse

  let fullDisposition = Array.from({ length: $days.length }).map<number[]>((a) => [])

  type TaskDisposition = {
    row: number
    columnStart: number
    columnEnd: number
  }

  let tasksDisposition = Array.from({ length: tasks.length }).map<TaskDisposition>(() => ({
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
      if (partialDisposition.every((column) => !column[index])) {
        row = index
      }
    }

    if (row === null) {
      row = Math.max(...partialDisposition.map((arr) => arr.length))
    }

    for (let index = partialStart; index < partialEnd; index++) {
      fullDisposition[index][row] = task.id
    }

    // We always increase the row by one because to convert an array index into a css grid row (0 -> 1, 1 -> 2, etc)
    tasksDisposition[taskIndex].row = row + TIMELINE_START_ROW + 1
    tasksDisposition[taskIndex].columnStart = columnStart
    tasksDisposition[taskIndex].columnEnd = columnEnd
  })

  const maxRow = Math.max(...tasksDisposition.map((disposition) => disposition.row))
</script>

<style>
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
    @apply border-slate-300;
    grid-row: 1 / -1;
    grid-column: var(--day-column);
  }

  .dayIsWeekend {
    @apply bg-slate-200;
    @apply bg-opacity-60;
  }

  .task {
    grid-row: var(--task-row);
    grid-column: var(--task-column-start) / var(--task-column-end);
    border: 1px solid;
    @apply border-red-400;
  }
</style>

<div class="wrapper flex-1">
  <div class="gridWrapper days">
    {#each $days as day, index}
      <div class="day bg-slate-50" class:dayIsWeekend={day.isWeekend} style="--day-column: {index}"></div>
    {/each}
  </div>

  <div
    class="gridWrapper tasks"
    style="--grid-rows: {maxRow}; --grid-columns: {$days.length}; --grid-column-size: {TIMELINE_DAY_SIZE}"
  >
    {#each tasks as task, index}
      {@const color = TASK_COLORS.find((taskColor) => taskColor.id === task.color_id)?.rgb ?? 'black'}
      {@const disposition = tasksDisposition[index]}

      <div
        class="task m-1 rounded-md p-1 text-sm"
        style="--task-row: {disposition.row}; --task-column-start: {disposition.columnStart}; --task-column-end: {disposition.columnEnd}"
      >
        {task.name}

        <br />
      </div>
    {/each}
  </div>
</div>
