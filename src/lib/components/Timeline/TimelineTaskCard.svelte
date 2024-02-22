<script lang="ts">
  import getRelativeLuminance from 'get-relative-luminance'
  import { DEFAULT_TASK_COLOR, TASK_COLORS } from '../../constants/colors'
  import type { Task } from '../../types/plan'
  import type { TaskDisposition } from '../../types/timeline'

  export let element: 'button' | 'div'
  export let task: Task
  export let disposition: TaskDisposition
  export let isDragging: boolean
  export let isGhost: boolean = false
  export let x: number = 0
  export let y: number = 0

  const color = TASK_COLORS.find((taskColor) => taskColor.id === task.color_id) ?? DEFAULT_TASK_COLOR
  const luminance = getRelativeLuminance(color.rgb)
  const isDarkColor = luminance <= 0.5

  function getTimeLabel(minutes: number) {
    let label = ''
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60

    if (minutes < 60) {
      label = `${minutes}m`
    } else if (remainingMinutes) {
      label = `${hours}h ${remainingMinutes}m`
    } else {
      label = `${hours}h`
    }

    label += ' daily'

    return label
  }

  const timeLabel = getTimeLabel(task.daily_estimated_minutes || task.estimated_minutes)
</script>

<style lang="postcss">
  .task {
    grid-row: var(--task-row);
    grid-column: var(--task-column-start) / var(--task-column-end);
    background-color: var(--task-background);
    @apply m-1 flex flex-col justify-center rounded-md px-2 text-left align-top text-sm text-slate-900;
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
    position: relative;
    z-index: 1;
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
  style:transform="translate({x}px, {y}px)"
  title={`${task.name} (${timeLabel})`}
  on:mousedown|preventDefault
  on:mouseup|preventDefault
  on:touchstart|preventDefault
  on:touchend|preventDefault
>
  <span class="overflow-hidden text-ellipsis whitespace-nowrap font-bold">
    {task.name}
  </span>

  <span class="overflow-hidden text-ellipsis whitespace-nowrap text-xs text-slate-50">
    {timeLabel}
  </span>
</svelte:element>
