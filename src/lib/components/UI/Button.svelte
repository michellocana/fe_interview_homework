<script lang="ts">
  export let type: 'button' | 'submit'
</script>

<button
  {type}
  class="inline-block w-full rounded-md bg-purple-600 px-3.5 py-3 text-sm font-semibold text-white shadow-sm outline outline-2 outline-offset-1 outline-transparent transition-all hover:bg-purple-500 focus:bg-purple-500 focus:outline-purple-500"
>
  <slot />
</button>
