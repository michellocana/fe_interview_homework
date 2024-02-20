<script lang="ts">
  import dayjs from 'dayjs'
  import { api } from '../../api'
  import { TIMELINE_DAY_SIZE } from '../constants/timeline'
  import { timelineStartDate } from '../stores/timeline'
  import type { TasksResponse } from '../types/network'
  import TimelineDays from './TimelineDays.svelte'
  import TimelineTasks from './TimelineTasks.svelte'

  let tasksRequest = fetchTasks()
  let didScrollToStartDay: boolean = false

  async function fetchTasks() {
    const result = await api.get<TasksResponse>(`${import.meta.env.VITE_TOGGL_PLAN_WORKSPACE_ID}/tasks`)
    return result.data.sort((taskA, taskB) => taskA.weight - taskB.weight)
  }

  let wrapper: HTMLDivElement

  $: if (wrapper && !didScrollToStartDay) {
    const today = dayjs()
    const dayTotalSize = TIMELINE_DAY_SIZE * 2
    const daysDiff = today.diff($timelineStartDate, 'days')

    // Scrolling to current day, but showing the last 3 days just like the production app
    wrapper.scroll({ left: dayTotalSize * (daysDiff - 3) })
    didScrollToStartDay = true
  }
</script>

{#await tasksRequest}
  loading timeline...
{:then tasks}
  <div class="wrapper flex flex-1 flex-col items-start overflow-auto" bind:this={wrapper}>
    <TimelineDays />
    <TimelineTasks {tasks} />
  </div>
{/await}
