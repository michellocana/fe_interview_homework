<script lang="ts">
  import { onDestroy, onMount } from 'svelte'
  import TimelineTaskCard from './TimelineTaskCard.svelte'
  import type { Task } from '../../types/plan'
  import type { TaskDisposition } from '../../types/timeline'

  export let task: Task
  export let disposition: TaskDisposition
  export let onDragEnd: (x: number, y: number) => void = (x, y) => {}

  // Drag controls
  let isDragging: boolean = false
  let dragInitialX: number = 0
  let dragInitialY: number = 0
  let x: number = 0
  let y: number = 0

  type MouseOrTouchEvent = MouseEvent | TouchEvent

  function extractPosition(event: MouseOrTouchEvent, property: 'clientX' | 'clientY') {
    return event instanceof MouseEvent ? event[property] : event.touches[0][property]
  }

  function onMove(event: MouseOrTouchEvent) {
    if (isDragging) {
      x = extractPosition(event, 'clientX') - dragInitialX
      y = extractPosition(event, 'clientY') - dragInitialY
    }
  }

  onMount(() => {
    document.addEventListener('mousemove', onMove)
    document.addEventListener('touchmove', onMove)
  })
  onDestroy(() => {
    document.removeEventListener('mousemove', onMove)
    document.removeEventListener('touchmove', onMove)
  })

  function onDown(event: MouseOrTouchEvent) {
    isDragging = true
    dragInitialX = extractPosition(event, 'clientX')
    dragInitialY = extractPosition(event, 'clientY')
  }

  function onUp() {
    onDragEnd(x, y)
    isDragging = false
    x = 0
    y = 0
  }
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
  on:mousedown={onDown}
  on:mouseup={onUp}
  on:touchstart={onDown}
  on:touchend={onUp}
/>
