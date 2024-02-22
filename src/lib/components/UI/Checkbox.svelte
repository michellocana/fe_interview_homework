<script lang="ts">
  export let name: string
  export let label: string
  export let checked: boolean
</script>

<div class="checkbox flex gap-2">
  <input {name} id={name} type="checkbox" class="accent-fuchsia-200" bind:checked />
  <label for={name}>{label}</label>
</div>
