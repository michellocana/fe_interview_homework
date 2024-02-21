<script lang="ts">
  export let name: string
  export let placeholder: string
  export let value: string
</script>

<input
  type="text"
  class="rounded-md border-2 p-2 outline outline-2 outline-transparent transition-all focus:outline-fuchsia-900"
  {name}
  {placeholder}
  bind:value
/>
