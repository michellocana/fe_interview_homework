<script lang="ts">
  import dayjs from 'dayjs'
  import { onMount } from 'svelte'

  import TimelineDays from './TimelineDays.svelte'
  import TimelineTasks from './TimelineTasks.svelte'
  import type { TasksRequest, TasksResponse } from '../../types/network'
  import { timelineEndDate, timelineStartDate } from '../../stores/timeline'
  import { api } from '../../../api'
  import { TIMELINE_DAY_SIZE } from '../../constants/timeline'
  import { config, user } from '../../stores/auth'
  import Spinner from '../UI/Spinner.svelte'
  import diffWeekDays from '../../helpers/diffWeekDays'

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

  $: if (wrapper) {
    const today = dayjs()
    const daysDiff = today.diff($timelineStartDate, 'days')

    if (!didScrollToStartDay) {
      // Scrolling to current day, but showing the last 3 days just like the production app
      wrapper.scroll(TIMELINE_DAY_SIZE * (daysDiff - 3), 0)
      didScrollToStartDay = true
    } else {
      const hideWeekends = $user.preferences.hide_weekends

      // Scrolling to current day whenever the hide weekends setting changes
      if (hideWeekends) {
        const diff = diffWeekDays($timelineStartDate, today) - 3
        wrapper.scroll(TIMELINE_DAY_SIZE * diff, 0)
      } else {
        wrapper.scroll(TIMELINE_DAY_SIZE * (daysDiff - 3), 0)
      }
    }
  }
</script>

{#if isFetchingTasks}
  <p class="flex w-full items-center justify-center gap-3 text-base text-slate-800">
    <Spinner />
    Loading timeline...
  </p>
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
