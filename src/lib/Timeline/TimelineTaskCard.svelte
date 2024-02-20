<script lang="ts">
  import { DEFAULT_TASK_COLOR, TASK_COLORS } from '../constants/colors'
  import type { TaskDisposition } from '../types/timeline'
  import getRelativeLuminance from 'get-relative-luminance'

  export let element: 'button' | 'div'
  export let task: Task
  export let disposition: TaskDisposition
  export let isDragging: boolean
  export let isGhost: boolean = false

  const color = TASK_COLORS.find((taskColor) => taskColor.id === task.color_id) ?? DEFAULT_TASK_COLOR
  const luminance = getRelativeLuminance(color.rgb)
  const isDarkColor = luminance <= 0.5
</script>

<style lang="postcss">
  .task {
    grid-row: var(--task-row);
    grid-column: var(--task-column-start) / var(--task-column-end);
    background-color: var(--task-background);
    @apply m-1 flex rounded-md px-2 py-1 text-left align-top text-sm text-slate-900;
    cursor: grab;
    user-select: none;
  }

  .taskIsDark {
    @apply text-white;
  }

  .taskIsBeingDragged {
    @apply opacity-60;
  }

  .taskIsDragging {
  }
</style>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<svelte:element
  this={element}
  class="task"
  class:taskIsDark={isDarkColor}
  class:taskIsBeingDragged={isGhost && isDragging}
  class:taskIsDragging={!isGhost && isDragging}
  style="--task-row: {disposition.row}; --task-column-start: {disposition.columnStart}; --task-column-end: {disposition.columnEnd}; --task-background: {color?.rgb}"
  on:click
  on:mousedown
  on:mouseup
>
  <span class="font-bold">
    {task.name}
  </span>
</svelte:element>
