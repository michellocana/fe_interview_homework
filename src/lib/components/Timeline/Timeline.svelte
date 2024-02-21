<script lang="ts">
  import dayjs from 'dayjs'
  import { onMount } from 'svelte'

  import TimelineDays from './TimelineDays.svelte'
  import TimelineTasks from './TimelineTasks.svelte'
  import type { TasksRequest, TasksResponse } from '../../types/network'
  import { timelineEndDate, timelineStartDate } from '../../stores/timeline'
  import { api } from '../../../api'
  import { TIMELINE_DAY_SIZE } from '../../constants/timeline'
  import { config } from '../../stores/auth'

  let tasks: TasksResponse
  let isFetchingTasks = true
  let didScrollToStartDay = false

  onMount(async () => {
    const result = await api.get<TasksResponse>(`${$config.workspaceId}/tasks`, {
      params: {
        since: $timelineStartDate.toISOString(),
        until: $timelineEndDate.toISOString(),
      } satisfies TasksRequest,
    })

    tasks = result.data.sort((taskA, taskB) => taskA.weight - taskB.weight)
    isFetchingTasks = false
  })

  let wrapper: HTMLDivElement

  $: if (wrapper && !didScrollToStartDay) {
    const today = dayjs()
    const daysDiff = today.diff($timelineStartDate, 'days')

    // Scrolling to current day, but showing the last 3 days just like the production app
    wrapper.scroll(TIMELINE_DAY_SIZE * (daysDiff - 3), 0)
    didScrollToStartDay = true
  }
</script>

{#if isFetchingTasks}
  loading timeline...
{:else if tasks}
  <div class="flex flex-1 flex-col items-start overflow-auto" bind:this={wrapper}>
    <TimelineDays />
    <TimelineTasks
      {tasks}
      onTaskDragEnd={(task, x, y) => {
        tasks = tasks.map((currentTask) => {
          if (currentTask.id === task.id) {
            const startDate = dayjs(currentTask.start_date)
            const endDate = dayjs(currentTask.end_date)
            const diff = Math.round(x / TIMELINE_DAY_SIZE)

            return {
              ...currentTask,
              start_date: startDate.add(diff, 'day').toString(),
              end_date: endDate.add(diff, 'day').toString(),
            }
          }

          return currentTask
        })
      }}
    />
  </div>
{/if}
