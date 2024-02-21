<script lang="ts">
  export let error: string
</script>

{#if error}
  <span class="block text-sm text-red-500">
    {error}
  </span>
{/if}
