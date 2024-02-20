<script lang="ts">
  import { DEFAULT_TASK_COLOR, TASK_COLORS } from '../constants/colors'
  import type { TaskDisposition } from '../types/timeline'
  import getRelativeLuminance from 'get-relative-luminance'
  import TimelineTaskCard from './TimelineTaskCard.svelte'

  export let task: Task
  export let disposition: TaskDisposition

  const color = TASK_COLORS.find((taskColor) => taskColor.id === task.color_id) ?? DEFAULT_TASK_COLOR
  const luminance = getRelativeLuminance(color.rgb)
  const isDarkColor = luminance <= 0.5

  let isDragging: boolean = false
</script>

{#if isDragging}
  <!-- TODO(michell): implement drag and drop -->
  <TimelineTaskCard isGhost {isDragging} {disposition} {task} element="div" />
{/if}

<TimelineTaskCard
  {isDragging}
  {disposition}
  {task}
  element="button"
  on:mousedown={(event) => {
    isDragging = true
  }}
  on:mouseup={(event) => {
    isDragging = false
  }}
/>
