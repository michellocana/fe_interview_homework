<script lang="ts">
  import { user } from '../../stores/auth'
  import Checkbox from '../UI/Checkbox.svelte'
  import Select from '../UI/Select.svelte'

  let startOfWeek: string = $user.preferences.start_of_week.toString()
  let hideWeekends: boolean = $user.preferences.hide_weekends

  $: {
    $user.preferences.start_of_week = Number(startOfWeek)
    $user.preferences.hide_weekends = hideWeekends
  }
</script>

<style lang="postcss">
  .sectionTitle {
    @apply text-sm font-bold;
  }

  .section {
    @apply flex flex-col gap-2;
  }

  .preference {
    @apply flex items-center gap-2;
  }

  .preferenceName {
    @apply flex-none;
  }
</style>

<div
  class="relative z-10 flex w-full flex-none flex-col items-start gap-4 bg-fuchsia-950 p-4 text-slate-100 shadow-lg shadow-slate-300 lg:w-72 lg:shadow-xl lg:shadow-slate-900"
>
  <div class="flex w-full items-center gap-2">
    <img src={$user.picture_url} alt={$user.name} class="rounded-full" />
    <p class="overflow-hidden text-ellipsis whitespace-nowrap">
      Welcome, <strong>{$user.name}</strong>
    </p>
  </div>

  <section class="section">
    <p class="sectionTitle">Preferences</p>

    <div class="preference">
      <div class="preferenceName">Start of week:</div>

      <Select bind:value={startOfWeek} name="startOfWeek">
        <option value="0">Sunday</option>
        <option value="1">Monday</option>
        <option value="2">Tuesday</option>
        <option value="3">Wednesday</option>
        <option value="4">Thursday</option>
        <option value="5">Friday</option>
        <option value="6">Saturday</option>
      </Select>
    </div>

    <div class="preference">
      <div class="preferenceName">Hide weekends:</div>
      <Checkbox bind:checked={hideWeekends} name="hideWeekends" label="Enabled" />
    </div>
  </section>
</div>
