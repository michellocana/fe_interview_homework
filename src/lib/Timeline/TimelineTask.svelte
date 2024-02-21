<script lang="ts">
  import { onDestroy, onMount } from 'svelte'
  import type { TaskDisposition } from '../types/timeline'
  import TimelineTaskCard from './TimelineTaskCard.svelte'
  import type { Task } from '../types/plan'

  export let task: Task
  export let disposition: TaskDisposition
  export let onDragEnd: (x: number, y: number) => void = (x, y) => {}

  // Drag controls
  let isDragging: boolean = false
  let dragInitialX: number = 0
  let dragInitialY: number = 0
  let x: number = 0
  let y: number = 0

  function onMouseMove(event: MouseEvent) {
    if (isDragging) {
      x = event.clientX - dragInitialX
      y = event.clientY - dragInitialY
    }
  }

  onMount(() => document.addEventListener('mousemove', onMouseMove))
  onDestroy(() => document.removeEventListener('mousemove', onMouseMove))
</script>

{#if isDragging}
  <TimelineTaskCard isGhost {isDragging} {disposition} {task} element="div" />
{/if}

<TimelineTaskCard
  {isDragging}
  {disposition}
  {task}
  {x}
  {y}
  element="button"
  on:mousedown={(event) => {
    isDragging = true
    dragInitialX = event.clientX
    dragInitialY = event.clientY
  }}
  on:mouseup={(event) => {
    onDragEnd(x, y)
    isDragging = false
    x = 0
    y = 0
  }}
/>
