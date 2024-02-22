<script lang="ts">
  export let name: string
  export let value: string
</script>

<style lang="postcss">
  .select {
    border: 1px solid;
  }

  optgroup,
  option {
    @apply text-slate-800;
  }
</style>

<select class="select rounded-md border-slate-50 bg-transparent px-2 py-1.5 text-slate-100" {name} bind:value>
  <optgroup label="Select an option">
    <slot />
  </optgroup>
</select>
