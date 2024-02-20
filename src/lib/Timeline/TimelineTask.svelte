<script lang="ts">
  import { DEFAULT_TASK_COLOR, TASK_COLORS } from '../constants/colors'
  import type { TaskDisposition } from '../types/timeline'
  import getRelativeLuminance from 'get-relative-luminance'

  export let task: Task
  export let disposition: TaskDisposition

  const color = TASK_COLORS.find((taskColor) => taskColor.id === task.color_id) ?? DEFAULT_TASK_COLOR
  const luminance = getRelativeLuminance(color.rgb)
  const isDarkColor = luminance <= 0.5
</script>

<style lang="postcss">
  .task {
    grid-row: var(--task-row);
    grid-column: var(--task-column-start) / var(--task-column-end);
    background-color: var(--task-background);
    @apply text-slate-900;
  }

  .taskIsDark {
    @apply text-white;
  }
</style>

<div
  class="task m-1 rounded-md p-1 text-sm"
  class:taskIsDark={isDarkColor}
  style="--task-row: {disposition.row}; --task-column-start: {disposition.columnStart}; --task-column-end: {disposition.columnEnd}; --task-background: {color?.rgb}"
>
  {task.name}
</div>
