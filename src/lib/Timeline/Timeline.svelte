<script lang="ts">
  import dayjs from 'dayjs'
  import { api } from '../../api'
  import { TIMELINE_DAY_SIZE } from '../constants/timeline'
  import { timelineEndDate, timelineStartDate } from '../stores/timeline'
  import type { TasksRequest, TasksResponse } from '../types/network'
  import TimelineDays from './TimelineDays.svelte'
  import TimelineTasks from './TimelineTasks.svelte'

  let tasksRequest = fetchTasks()
  let didScrollToStartDay: boolean = false

  async function fetchTasks() {
    const result = await api.get<TasksResponse>(`${import.meta.env.VITE_TOGGL_PLAN_WORKSPACE_ID}/tasks`, {
      params: {
        since: $timelineStartDate.toISOString(),
        until: $timelineEndDate.toISOString(),
      } satisfies TasksRequest,
    })
    return result.data.sort((taskA, taskB) => taskA.weight - taskB.weight)
  }

  let wrapper: HTMLDivElement

  $: if (wrapper && !didScrollToStartDay) {
    const today = dayjs()
    const daysDiff = today.diff($timelineStartDate, 'days')

    // Scrolling to current day, but showing the last 3 days just like the production app
    wrapper.scroll(TIMELINE_DAY_SIZE * (daysDiff - 3), 0)
    didScrollToStartDay = true
  }
</script>

{#await tasksRequest}
  loading timeline...
{:then tasks}
  <div class="flex flex-1 flex-col items-start overflow-auto" bind:this={wrapper}>
    <TimelineDays />
    <TimelineTasks {tasks} />
  </div>
{/await}
