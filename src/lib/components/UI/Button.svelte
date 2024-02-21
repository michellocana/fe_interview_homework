<script lang="ts">
  export let type: 'button' | 'submit'
</script>

<button
  {type}
  class="inline-block w-full rounded-md bg-fuchsia-900 px-3.5 py-3 text-sm font-semibold text-white outline outline-2 outline-offset-1 outline-transparent transition-all hover:bg-fuchsia-700 focus:bg-fuchsia-700 focus:outline-fuchsia-700"
>
  <slot />
</button>
