<script lang="ts">
  import { api } from '../../api'
  import type { TasksResponse } from '../types/network'
  import TimelineDays from './TimelineDays.svelte'

  let tasksRequest = fetchTasks()

  async function fetchTasks() {
    const result = await api.get<TasksResponse>(`${import.meta.env.VITE_TOGGL_PLAN_WORKSPACE_ID}/tasks`)
    return result.data
  }
</script>

<style lang="postcss">
  .wrapper {
  }
</style>

{#await tasksRequest}
  loading timeline...
{:then tasks}
  <div class="wrapper flex-1 overflow-auto">
    <TimelineDays />

    {#each tasks as task}
      {task.name} ({task.status})
      {task.color}
    {/each}
  </div>
{/await}
