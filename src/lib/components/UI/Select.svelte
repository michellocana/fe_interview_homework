<script lang="ts">
  export let name: string
  export let value: string
</script>

<style lang="postcss">
  .select {
    border: 1px solid;
    appearance: none;
  }

  optgroup,
  option {
    @apply text-slate-800;
  }
</style>

<div class="relative">
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke-width="1.5"
    stroke="currentColor"
    class="absolute bottom-0 right-1 top-0 m-auto h-4"
  >
    <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
  </svg>

  <select class="select rounded-md border-slate-50 bg-transparent px-2 py-1.5 pr-6 text-slate-100" {name} bind:value>
    <optgroup label="Select an option">
      <slot />
    </optgroup>
  </select>
</div>
